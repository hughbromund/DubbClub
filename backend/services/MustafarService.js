const path = require("path");
const axios = require("axios");

exports.getMustafarPredictions = async function() {
    let url = "https://mustafar.dubb.club/predictnbawin/" + 8705
    let res = await axios.get(url) 
    console.log(res.data)
    return res.data   
}