/* Team Info Dict */

/* Color Codes from https://teamcolorcodes.com/ */

/*
108 LAA Angels
109 ARI D-backs
110 BAL Orioles
111 BOS Red So
112 CHC Cubs
113 CIN Reds
114 CLE Indians
115 COL Rockies
116 DET Tigers
117 HOU Astros
118 KC Royals
119 LAD Dodgers
120 WSH Nationals
121 NYM Mets
133 OAK Athletics
134 PIT Pirates
135 SD Padres
136 SEA Mariners
137 SF Giants
138 STL Cardinals
139 TB Rays
140 TEX Rangers
141 TOR Blue Jays
142 MIN Twins
143 PHI Phillies
144 ATL Braves
145 CWS White Sox
146 MIA Marlins
147 NYY Yankees

158 MIL Brewers
*/

export const MLB_TEAM_INFO = {
  "Los Angeles Angels": {
    teamID: 108,
    hexColor: "#003263",
  },
  "Arizona Diamondbacks": {
    teamID: 109,
    hexColor: "#A71930",
  },
  "Baltimore Orioles": {
    teamID: 110,
    hexColor: "#DF4601",
  },
  "Boston Red Sox": {
    teamID: 111,
    hexColor: "#BD3039",
  },
  "Chicago Cubs": {
    teamID: 112,
    hexColor: "#0E3386",
  },
  "Cincinnati Reds": {
    teamID: 113,
    hexColor: "#C6011F",
  },
  "Cleveland Indians": {
    teamID: 114,
    hexColor: "#0C2340",
  },
  "Colorado Rockies": {
    teamID: 115,
    hexColor: "#33006F",
  },
  "Detroit Tigers": {
    teamID: 116,
    hexColor: "#0C2340",
  },
  "Houston Astros": {
    teamID: 117,
    hexColor: "#002D62",
  },
  "Kansas City Royals": {
    teamID: 118,
    hexColor: "#004687",
  },
  "Los Angeles Dodgers": {
    teamID: 119,
    hexColor: "#005A9C",
  },
  "Washington Nationals": {
    teamID: 120,
    hexColor: "#AB0003",
  },
  "New York Mets": {
    teamID: 121,
    hexColor: "#002D72",
  },
  "Oakland Athletics": {
    teamID: 133,
    hexColor: "#003831",
  },
  "Pittsburgh Pirates": {
    teamID: 134,
    hexColor: "#27251F",
  },
  "San Diego Padres": {
    teamID: 135,
    hexColor: "#2F241D",
  },
  "Seattle Mariners": {
    teamID: 136,
    hexColor: "#0C2C56",
  },
  "San Francisco Giants": {
    teamID: 137,
    hexColor: "#FD5A1E",
  },
  "St. Louis Cardinals": {
    teamID: 138,
    hexColor: "#C41E3A",
  },
  "Tampa Bay Rays": {
    teamID: 139,
    hexColor: "#092C5C",
  },
  "Texas Rangers": {
    teamID: 140,
    hexColor: "#003278",
  },
  "Toronto Blue Jays": {
    teamID: 141,
    hexColor: "#134A8E",
  },
  "Minnesota Twins": {
    teamID: 142,
    hexColor: "#002B5C",
  },
  "Philadelphia Phillies": {
    teamID: 143,
    hexColor: "#E81828",
  },
  "Atlanta Braves": {
    teamID: 144,
    hexColor: "#CE1141",
  },
  "Chicago White Sox": {
    teamID: 145,
    hexColor: "#27251F",
  },
  "Miami Marlins": {
    teamID: 146,
    hexColor: "#00A3E0",
  },
  "New York Yankees": {
    teamID: 147,
    hexColor: "#003087",
  },
  "Milwaukee Brewers": {
    teamID: 158,
    hexColor: "#ffc52f",
  },
};

const normalizeTeam = (str) => {
  return str.trim().toUpperCase();
};

const getSomethingByTeam = (str, desiredValue) => {
  // str = normalizeTeam(str);
  // console.log(str);
  if (MLB_TEAM_INFO[str] !== undefined) {
    return MLB_TEAM_INFO[str][desiredValue];
  }
  // for (const team in EPL_TEAM_INFO) {
  //   if (str === team.toUpperCase()) {

  //   }
  // }
};

export const getMLBIdByTeam = (str) => {
  return getSomethingByTeam(str, "teamID");
};

export const getMLBColorByTeam = (str) => {
  var hexColor = getSomethingByTeam(str, "hexColor");
  if (hexColor === undefined) {
    return "#000000";
  }
  return hexColor;
};

export const getMLBTeamByID = (id) => {
  for (const team in MLB_TEAM_INFO) {
    if (Number(id) === MLB_TEAM_INFO[team]["teamID"]) {
      return team;
    }
  }
  return 0;
};
