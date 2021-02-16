const path = require("path");
const request = require('request');
const config = require(path.resolve(__dirname, "../config.js"));

/*
const options = {
  method: 'GET',
  url: 'https://api-nba-v1.p.rapidapi.com/games/seasonYear/2020',
  headers: {
    'x-rapidapi-key': '5362a63490mshea01f5d67c0821bp19ffd2jsna718407b8af5',
    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
    useQueryString: true
  }
};

*/

exports.getBasicGameInfo = async function() {
  var start = new Date();
  var end = new Date(start.getFullYear, start.getMonth, start.getDay);
  var todayDate = new Date().toISOString().slice(0,10);
  console.log(todayDate);
  console.log(start);
  console.log(end);
  var json = [];
  for (var i = 0; i < 7; i++) {
    console.log("hi");
    console.log(d);
  }
}
