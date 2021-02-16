export const TOKEN_KEY = "token";

/* Paths for frontend routing */
export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/join";

/* Base URL for Backend */
export var BASE = "https://api.dubb.club";
// console.log("NODE_ENV: " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  BASE = "http://localhost:5000";
}

/* Paths to Call Backend */
export const LOGIN = BASE + "/api/auth/login";
export const SIGNUP = BASE + "/api/auth/signup";
export const REFRESH_TOKEN = BASE + "/api/auth/refresh";
