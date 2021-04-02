/* Team Info Dict */

/* Color Codes from https://teamcolorcodes.com/ */

export const NBA_TEAM_INFO = {
  "Atlanta Hawks": {
    teamID: 1,
    hexColor: "#E03A3E",
  },
  "Boston Celtics": {
    teamID: 2,
    hexColor: "#007A33",
  },
  "Brooklyn Nets": {
    teamID: 4,
    hexColor: "#000000",
  },
  "Charlotte Hornets": {
    teamID: 5,
    hexColor: "#00788C",
  },
  "Chicago Bulls": {
    teamID: 6,
    hexColor: "#CE1141",
  },
  "Cleveland Cavaliers": {
    teamID: 7,
    hexColor: "#860038",
  },
  "Dallas Mavericks": {
    teamID: 8,
    hexColor: "#00538C",
  },
  "Denver Nuggets": {
    teamID: 9,
    hexColor: "#0E2240",
  },
  "Detroit Pistons": {
    teamID: 10,
    hexColor: "#C8102E",
  },
  "Golden State Warriors": {
    teamID: 11,
    hexColor: "#1D428A",
  },
  "Houston Rockets": {
    teamID: 14,
    hexColor: "#CE1141",
  },
  "Indiana Pacers": {
    teamID: 15,
    hexColor: "#FDBB30",
  },
  "LA Clippers": {
    teamID: 16,
    hexColor: "#C8102E",
  },
  "Los Angeles Lakers": {
    teamID: 17,
    hexColor: "#552583",
  },
  "Memphis Grizzlies": {
    teamID: 19,
    hexColor: "#5D76A9",
  },
  "Miami Heat": {
    teamID: 20,
    hexColor: "#98002E",
  },
  "Milwaukee Bucks": {
    teamID: 21,
    hexColor: "#00471B",
  },
  "Minnesota Timberwolves": {
    teamID: 22,
    hexColor: "#0C2340",
  },
  "New Orleans Pelicans": {
    teamID: 23,
    hexColor: "#0C2340",
  },
  "New York Knicks": {
    teamID: 24,
    hexColor: "#F58426",
  },
  "Oklahoma City Thunder": {
    teamID: 25,
    hexColor: "#007AC1",
  },
  "Orlando Magic": {
    teamID: 26,
    hexColor: "#0077C0",
  },
  "Philadelphia 76ers": {
    teamID: 27,
    hexColor: "#006BB6",
  },
  "Phoenix Suns": {
    teamID: 28,
    hexColor: "#1D1160",
  },
  "Portland Trail Blazers": {
    teamID: 29,
    hexColor: "#E03A3E",
  },
  "Sacramento Kings": {
    teamID: 30,
    hexColor: "#5A2D81",
  },
  "San Antonio Spurs": {
    teamID: 31,
    hexColor: "#C4CED4",
  },
  "Toronto Raptors": {
    teamID: 38,
    hexColor: "#CE1141",
  },
  "Utah Jazz": {
    teamID: 40,
    hexColor: "#00471B",
  },
  "Washington Wizards": {
    teamID: 41,
    hexColor: "#002B5C",
  },
};

export const normalizeTeam = (str) => {
  return str.trim().toUpperCase();
};

const getSomethingByTeam = (str, desiredValue) => {
  str = normalizeTeam(str);
  for (const team in NBA_TEAM_INFO) {
    if (str === team.toUpperCase()) {
      return NBA_TEAM_INFO[team][desiredValue];
    }
  }
};

export const getIdByTeam = (str) => {
  return getSomethingByTeam(str, "teamID");
};

export const getColorByTeam = (str) => {
  var hexColor = getSomethingByTeam(str, "hexColor");
  if (hexColor === undefined) {
    return "#000000";
  }
  return hexColor;
};

export const getTeamByID = (id) => {
  for (const team in NBA_TEAM_INFO) {
    if (id === NBA_TEAM_INFO[team]["teamID"]) {
      return team;
    }
  }
  return 0;
};
