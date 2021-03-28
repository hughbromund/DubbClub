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
export const VOTING_ROUTE = "/voting";
export const RESET_PASSWORD_ROUTE = "/resetPassword";

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
export const UPDATE_PHONE_NUMBER = BASE + "/api/user/updatePhoneNumber";
export const UPDATE_NOTIFICATIONS = BASE + "/api/user/updateNotifications";
export const UPDATE_SPOILERS = BASE + "/api/user/updateSpoilers";
export const NEXT_SEVEN_DAYS_BASIC_GAME_INFO =
  BASE + "/api/nba/getBasicGameInfo";
export const UPCOMING_GAMES_ID = BASE + "/api/nba/getUpcomingGameIdsFromDb";
export const UPCOMING_GAMES_INFO = BASE + "/api/nba/getUpcomingGamesFromDb";
export const GET_GAMES_BY_DATE = BASE + "/api/nba/getGamesByDate";
export const GET_GAMES_BY_TEAM = BASE + "/api/nba/getRecentGamesByTeam";
export const GET_GAME_BY_ID_FROM_DB = BASE + "/api/nba/getGameFromDb";
export const GET_GAME_BY_ID = BASE + "/api/nba/getGameDetailsByGameId";
export const GET_FAVORITE_TEAMS_LIST = BASE + "/api/user/favoriteteamlist";
export const FAVORITE_TEAM = BASE + "/api/user/favoriteteam";
export const UNFAVORITE_TEAM = BASE + "/api/user/unfavoriteteam";
export const RESET_PASSWORD_EMAIL = BASE + "/api/user/resetPasswordEmail";
export const RESET_PASSWORD = BASE + "/api/user/resetPassword";
export const NBA_VOTE = BASE + "/api/nba/vote";
export const GET_HIGH_VOTE_GAMES = BASE + "/api/nba/getHighVoteGames";
export const GET_VOTE_DIFF_GAMES = BASE + "/api/nba/getHighPredictDiffGames";

/* Date options to convert to UTC for Game Cards */
export const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "EST",
};
