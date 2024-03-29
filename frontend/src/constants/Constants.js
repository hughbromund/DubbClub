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
export const STANDINGS_ROUTE = "/standings";
export const GRAPH_TEST = "/graph";
export const VERIFY_EMAIL_ROUTE = "/verifyEmail";
export const TEAM_INFO_ROUTE = "/team";
export const PLAYER_INFO_ROUTE = "/player";

/* Base URL for Backend */
export var BASE = "https://api.dubbclub.shmem.io";
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
export const GET_GAMES_BY_DATE_DB = BASE + "/api/nba/getGamesByDateFromDb";
export const GET_GAMES_BY_TEAM_DB = BASE + "/api/nba/getGamesByTeamFromDb";
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
export const GET_NBA_STANDINGS = BASE + "/api/nba/getTeamsFromDb";
export const GET_LIVE_GAME_PREDS = BASE + "/api/nba/getLiveGamePreds";
export const GET_DASHBOARD = BASE + "/api/user/getDashboard";
export const SEND_VERIFY_EMAIL = BASE + "/api/user/sendVerifyEmail";
export const VERIFY_EMAIL = BASE + "/api/user/verifyEmail";
export const AUTOCOMPLETE_SEARCH = BASE + "/api/autoComplete";
export const GET_PLAYER_INFO = BASE + "/api/nba/getPlayer";

/* EPL constants */
export const EPL_GET_UPCOMING_GAMES = BASE + "/api/epl/getUpcomingGamesFromDb";
export const EPL_GET_GAMES_BY_DATE = BASE + "/api/epl/getGamesByDate";
export const EPL_GET_GAMES_BY_TEAM = BASE + "/api/epl/getGamesByTeamFromDb";
export const EPL_GET_GAME_BY_ID = BASE + "/api/epl/getGameFromDb";
export const EPL_GET_TEAM_STATS = BASE + "/api/epl/getTeamStats";
export const EPL_GET_ALL_TEAM_STATS = BASE + "/api/epl/getAllTeamStats";
export const EPL_VOTE = BASE + "/api/epl/vote";

/* MLB constants */
export const MLB_GET_GAME_BY_ID = BASE + "/api/mlb/getGameFromDb";
export const MLB_GET_LIVE_GAME_PREDS = BASE + "/api/mlb/getLiveGamePreds";
export const MLB_GET_GAMES_BY_TEAM = BASE + "/api/mlb/getGamesByTeamFromDb";
export const MLB_GET_ALL_TEAM_STATS = BASE + "/api/mlb/getTeamsFromDb";
export const MLB_GET_TEAM_STATS = BASE + "/api/mlb/getTeamFromDb";
export const MLB_VOTE = BASE + "/api/mlb/vote";

/* Date options to convert to UTC for Game Cards */
export const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "EST",
};
export const REFRESH_RATE = 60000;

export const SCHEDULED = "Scheduled";
export const LIVE = "In Play";
export const FINISHED = "Finished";

export const NBA = "NBA";
export const EPL = "EPL";
export const MLB = "MLB";
