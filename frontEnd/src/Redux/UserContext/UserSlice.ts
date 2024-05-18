import { createSlice } from "@reduxjs/toolkit"

interface UserState {
    uuid?: string | null
    token?: string | null
    isAuth?: boolean
    fullScreenLock?: boolean | null
    disableNavbar?: boolean | null
}

const initialState: UserState = {
    uuid: null,
    token: null,
    isAuth: false,
    fullScreenLock: false,
    disableNavbar: false,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        InitializeUser: (state: UserState, action) => {
            state.token = action.payload.token
            state.isAuth = true
            state.uuid = action.payload.uuid
        },
        UpdateUser: (state: UserState, action) => {
            console.log(action)
            state.isAuth = true
        },
        RemoveUser: (state: UserState) => {
            state.token = null
            state.isAuth = false
            state.uuid = null
        },
        setFullScreenLock: (state: UserState) => {
            state.fullScreenLock = true
        },
        disableFullScreenLock: (state: UserState) => {
            state.fullScreenLock = false
        },
        disableNavbar: (state: UserState) => {
            state.disableNavbar = true
        },
        enableNavbar: (state: UserState) => {
            state.disableNavbar = false
        },
    },
})

export const { disableNavbar, enableNavbar, InitializeUser, RemoveUser, UpdateUser,  setFullScreenLock, disableFullScreenLock } = userSlice.actions

export const selectIsAuth = (state: UserState) => state.isAuth
export const selectIsToken = (state: UserState) => (state.token ? state.token : null)
export const selectUUID = (state: UserState) => (state.uuid ? state.uuid : null)
export const selectIsFullScreen = (state: UserState) => state.fullScreenLock || false
export const selectIsNavbar = (state: UserState) => state.disableNavbar || false

export default userSlice.reducer
