/* Team Info Dict */
export const NBA_TEAM_INFO = {
  "Atlanta Hawks": {
    teamID: 1,
  },
  "Boston Celtics": {
    teamID: 2,
  },
  "Brooklyn Nets": {
    teamID: 4,
  },
  "Charlotte Hornets": {
    teamID: 5,
  },
  "Chicago Bulls": {
    teamID: 6,
  },
  "Cleveland Cavaliers": {
    teamID: 7,
  },
  "Dallas Mavericks": {
    teamID: 8,
  },
  "Denver Nuggets": {
    teamID: 9,
  },
  "Detroit Pistons": {
    teamID: 10,
  },
  "Golden State Warriors": {
    teamID: 11,
  },
  "Houston Rockets": {
    teamID: 14,
  },
  "Indiana Pacers": {
    teamID: 15,
  },
  "Los Angeles Clippers": {
    teamID: 16,
  },
  "Los Angeles Lakers": {
    teamID: 17,
  },
  "Memphis Grizzlies": {
    teamID: 19,
  },
  "Miami Heat": {
    teamID: 20,
  },
  "Milwaukee Bucks": {
    teamID: 21,
  },
  "Minnesota Timberwolves": {
    teamID: 22,
  },
  "New Orleans Pelicans": {
    teamID: 23,
  },
  "New York Knicks": {
    teamID: 24,
  },
  "Oklahoma City Thunder": {
    teamID: 25,
  },
  "Orlando Magic": {
    teamID: 26,
  },
  "Philadelphia 76ers": {
    teamID: 27,
  },
  "Phoenix Suns": {
    teamID: 28,
  },
  "Portland Trail Blazers": {
    teamID: 29,
  },
  "Sacramento Kings": {
    teamID: 30,
  },
  "San Antonio Spurs": {
    teamID: 31,
  },
  "Toronto Raptors": {
    teamID: 38,
  },
  "Utah Jazz": {
    teamID: 40,
  },
  "Washington Wizards": {
    teamID: 41,
  },
};

export const normalizeTeam = (str) => {
  return str.trim().toUpperCase();
};

export const getIdByTeam = (str) => {
  str = normalizeTeam(str);
  for (const team in NBA_TEAM_INFO) {
    if (str === team.toUpperCase()) {
      return NBA_TEAM_INFO[team]["teamID"];
    }
  }
};
