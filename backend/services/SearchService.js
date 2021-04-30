const path = require("path");
const axios = require("axios");
const config = require(path.resolve(__dirname, "../config.json"));
const NBAgame = require(path.resolve(__dirname, "../database/models/NBAgame"));
const NBAteam = require(path.resolve(__dirname, "../database/models/NBAteam"));
const NBAplayer = require(path.resolve(
  __dirname,
  "../database/models/NBAplayer"
));
const EPLteam = require("../database/models/EPLteam");
const MLBteam = require("../database/models/MLBteam");

exports.autocomplete = async function (query) {
  var input = query;

  let playerQuery = NBAplayer.aggregate([
    {
      $project: {
        _id: 0,
        id: "$playerInfo.playerId",
        teamImage: "$playerInfo.teamImage",
        name: {
          $concat: ["$playerInfo.firstName", " ", "$playerInfo.lastName"],
        },
      },
    },
    { $match: { name: { $regex: ".*" + input + ".*", $options: "i" } } },
  ]);

  let nbaQuery = NBAteam.aggregate([
    { $match: { teamName: { $regex: ".*" + input + ".*", $options: "i" } } },
    {
      $project: {
        _id: 0,
        teamName: 1,
        teamImage: 1,
        teamId: 1,
        league: { $literal: "NBA" },
      },
    },
  ]).exec();

  let mlbQuery = MLBteam.aggregate([
    { $match: { teamName: { $regex: ".*" + input + ".*", $options: "i" } } },
    {
      $project: {
        _id: 0,
        teamName: 1,
        teamImage: 1,
        teamId: 1,
        league: { $literal: "MLB" },
      },
    },
  ]).exec();

  let eplQuery = EPLteam.aggregate([
    { $match: { teamName: { $regex: ".*" + input + ".*", $options: "i" } } },
    {
      $project: {
        _id: 0,
        teamName: 1,
        teamImage: 1,
        teamId: 1,
        league: { $literal: "EPL" },
      },
    },
  ]).exec();

  let results = await Promise.all([nbaQuery, mlbQuery, eplQuery, playerQuery]);

  let nbaResults = results[0];
  let mlbResults = results[1];
  let eplResults = results[2];

  let teamResults = nbaResults.concat(mlbResults).concat(eplResults);

  let playerResults = results[3];

  // console.log(playerResults);

  return { players: playerResults, teams: teamResults };
};

exports.autoCompleteEPL = async function (searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  let results = await EPLteam.find(
    {},
    { teamId: 1, teamName: 1, teamImage: 1 }
  );

  results = results.filter((a) => {
    return a.teamName.toLowerCase().includes(searchTerm);
  });
  for (var i = 0; i < results.length; i++) {
    results[i] = results[i].toObject();
    results[i].league = "EPL";
  }

  return results;
};
