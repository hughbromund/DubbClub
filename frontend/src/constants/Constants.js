/* Keys for localstorage */
export const TOKEN_KEY = "token";
export const USERNAME_KEY = "username";

/* Paths for frontend routing */
export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/join";
export const SEARCH_ROUTE = "/search";
export const GAME_INFO_ROUTE = "/game";
export const ACCOUNT_ROUTE = "/account";
export const DASHBOARD_ROUTE = "/dashboard";

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
export const USER_INFO = BASE + "/api/user/info";
export const UPDATE_EMAIL = BASE + "/api/user/updateemail";
export const UPDATE_PASSWORD = BASE + "/api/user/updatepassword";
export const NEXT_SEVEN_DAYS_BASIC_GAME_INFO = BASE + "/getBasicGameInfo";
export const GET_GAMES_BY_DATE = BASE + "/getGamesByDate";

/* Date options to convert to UTC for Game Cards */
export const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "EST",
};
