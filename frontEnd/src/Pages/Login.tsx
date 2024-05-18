import { Paper, Stack, Text, Alert, Card, Center } from "@mantine/core"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import axios from "axios"
import { useMantineColorScheme, Group } from "@mantine/core"
import { useEffect, useState } from "react"
import { GOOGLE_LOGIN_ROUTE } from "../Utils/Urls"
import {  Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { InitializeUser, selectIsAuth } from "../Redux/UserContext/UserSlice"
import { IconAlertCircle } from "@tabler/icons-react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "@mantine/notifications"
import { useLocation } from "react-router-dom"
import ErrorBoundary from "../Components/CodePage/ErrorBoundary"
import { useInterval } from "@mantine/hooks"
import { REDIRECT_WAIT_SECONDS } from "../Utils/CacheTime"



export default function Login() {
    const location = useLocation()
    const navigate = useNavigate()
    const nextUrl = location.search.substring(6).trim()
    const [loginForbidden, setLoginForbidden] = useState(false)
    const [logoutAlert, setLogoutAlert] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [seconds, setSeconds] = useState(REDIRECT_WAIT_SECONDS)
    const interval = useInterval(() => setSeconds((s) => s - 1), 1000)

    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch()
    const { colorScheme } = useMantineColorScheme()
    const dark = colorScheme === "dark"

    useEffect(() => {
        if (location.search.includes("logout=true")) {
            setLogoutAlert(true)
            searchParams.delete("next")
            searchParams.delete("logout")
            setSearchParams(searchParams)
        }
    }, [])

    useEffect(() => {
        if (loginForbidden) {
            interval.start()
        }
        return () => interval.stop()
    }, [loginForbidden])

    useEffect(() => {
        if (seconds === 0) {
            interval.stop()
            interval.active = false
            navigate("/")
        }
    }, [seconds])

    const googleResponse = async (res: CredentialResponse) => {
        try {
            const tokenId = res.credential
            const response = await axios.post(GOOGLE_LOGIN_ROUTE, { tokenId })
            if (response.status === 200 || response.status === 201) {
                dispatch(
                    InitializeUser({
                        token: response.data.token,
                        uuid: response.data.data.user.id,
                    })
                )
                showNotification({
                    title: "Success",
                    message: "You have successfully logged in",
                    color: "green",
                })
                if (nextUrl !== null && nextUrl !== "") {
                    return navigate(nextUrl)
                } else return navigate("/")
            } else {
                if (response.status === 403) {
                    showNotification({
                        title: "Forbidden",
                        message: "Disabled by Admin",
                        color: "orange",
                    })
                } else {
                    showNotification({
                        title: "Error",
                        message: "Something went wrong",
                        color: "red",
                    })
                }
            }
        } catch (err: any) {
            if (err.response.status === 404 && err.response.data.status === "USER_NOT_FOUND") {
                if (nextUrl && nextUrl !==""){
                    navigate("/signup?next="+nextUrl, { state: { ...err.response.data } })
                    return
                }
                navigate("/signup", { state: { ...err.response.data } })
                showNotification({
                    title: "Oh no!",
                    message: "Looks like you don't have an account",
                    color: "orange",
                })
            } else if (err.response.status === 403) {
                setLoginForbidden(true)
                showNotification({
                    title: "Forbidden",
                    message: "Disabled by Admin",
                    color: "orange",
                })
            } else {
                showNotification({
                    color: "red",
                    title: "Hey !!",
                    message: err.response.data.message,
                    autoClose: false,
                })
                console.error("THIS IS THE ERROR", err)
            }
        } finally {
        }
    }

    if (isAuth) {
        if (nextUrl !== null && nextUrl !== "") {
            return <Navigate to={nextUrl} />
        }
        return <Navigate to="/" />
    }
    return (
        <div >
            {logoutAlert === true && (
                <Alert
                    styles={{ message: { fontSize: "1.2em" }, title: { fontSize: "1.4em" } }}
                    radius={"xs"}
                    icon={<IconAlertCircle size={25} />}
                    title="Logged Out!"
                    color="orange"
                    withCloseButton
                    onClose={() => setLogoutAlert(false)}
                >
                    You've been successfully logged out.
                </Alert>
            )}
            <Paper
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundImage: 'url("./static/images/NewLogin2.webp")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Card shadow="md" p="lg" radius="sm" withBorder>
                    <Card.Section withBorder inheritPadding>
                        <Center>
                            <Text size="sm"  m="lg">
                                <Group>Welcome back !</Group>
                            </Text>
                        </Center>
                    </Card.Section>
                    <br />

                    <Center>
                        <Stack align="center" m={"lg"}>
                            <ErrorBoundary>
                                <GoogleLogin
                                    width={275}
                                    shape="rectangular"
                                    useOneTap={true}
                                    theme={dark ? "filled_black" : "filled_blue"}
                                    onSuccess={async (credentialResponse) => {
                                        await googleResponse(credentialResponse)
                                    }}
                                    onError={() => {
                                        console.log("Login Failed")
                                    }}
                                />
                            </ErrorBoundary>
                        </Stack>
                    </Center>
                    <br />
                
                </Card>
            </Paper>
        </div>
    )
}
