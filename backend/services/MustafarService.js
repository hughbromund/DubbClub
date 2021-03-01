const path = require("path");
const axios = require("axios");

const config = require(path.resolve(__dirname, "../config.json"));

//async not working with mustafar
exports.getMustafarPredictions = async function(gameIds) {
    let results = []
/*
    for (var i = 0; i < gameIds.length; i++) {
        let url = "https://mustafar.dubb.club/predictnbawin/" + gameIds[i]
        console.log(url)
        let res = await axios.get(url)
        console.log(res.data)
        results.push(res.data)
    }
*/

    return results
}

exports.getMustafarPredictions = async function(gameIds) {
    
  
}