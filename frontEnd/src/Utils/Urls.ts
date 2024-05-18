export let BASE_URL = process.env.REACT_APP_NODE_ENV === "development" ? "http://localhost:3000/api/" : "/api/"

BASE_URL = "/api/"
// BASE_URL = "http://localhost:3000/api/";


export const GOOGLE_LOGIN_ROUTE = BASE_URL + "auth/google-login"


