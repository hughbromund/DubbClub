/* Team Info Dict */

/* Color Codes from https://teamcolorcodes.com/ */

export const EPL_TEAM_INFO = {
  Arsenal: {
    teamID: 42,
    hexColor: "#EF0107",
  },
  "Aston Villa": {
    teamID: 66,
    hexColor: "#95BFE5",
  },
  Brighton: {
    teamID: 51,
    hexColor: "#0057B8",
  },
  Burnley: {
    teamID: 44,
    hexColor: "#6C1D45",
  },
  Chelsea: {
    teamID: 49,
    hexColor: "#034694",
  },
  "Crystal Palace": {
    teamID: 52,
    hexColor: "#1B458F",
  },
  Everton: {
    teamID: 45,
    hexColor: "#003399",
  },
  Fulham: {
    teamID: 36,
    hexColor: "#CC0000",
  },
  Leeds: {
    teamID: 63,
    hexColor: "#FFCD00",
  },
  Leicester: {
    teamID: 46,
    hexColor: "#003090",
  },
  Liverpool: {
    teamID: 40,
    hexColor: "#C8102E",
  },
  "Manchester City": {
    teamID: 50,
    hexColor: "#6CABDD",
  },
  "Manchester United": {
    teamID: 33,
    hexColor: "#DA291C",
  },
  Newcastle: {
    teamID: 34,
    hexColor: "#241F20",
  },
  "Sheffield Utd": {
    teamID: 62,
    hexColor: "#EE2737",
  },
  Southampton: {
    teamID: 41,
    hexColor: "#D71920",
  },
  Tottenham: {
    teamID: 47,
    hexColor: "#132257",
  },
  "West Brom": {
    teamID: 60,
    hexColor: "#122F67",
  },
  "West Ham": {
    teamID: 48,
    hexColor: "#7A263A",
  },
  Wolves: {
    teamID: 39,
    hexColor: "#FDB913",
  },
};

const normalizeTeam = (str) => {
  return str.trim().toUpperCase();
};

const getSomethingByTeam = (str, desiredValue) => {
  str = normalizeTeam(str);
  for (const team in EPL_TEAM_INFO) {
    if (str === team.toUpperCase()) {
      return EPL_TEAM_INFO[team][desiredValue];
    }
  }
};

export const getEPLIdByTeam = (str) => {
  return getSomethingByTeam(str, "teamID");
};

export const getEPLColorByTeam = (str) => {
  var hexColor = getSomethingByTeam(str, "hexColor");
  if (hexColor === undefined) {
    return "#000000";
  }
  return hexColor;
};

export const getEPLTeamByID = (id) => {
  for (const team in EPL_TEAM_INFO) {
    if (Number(id) === EPL_TEAM_INFO[team]["teamID"]) {
      return team;
    }
  }
  return 0;
};
