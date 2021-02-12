// from https://github.com/b-bly/simple-mern-passport

const path = require("path");
const config = require(path.resolve(__dirname, "../config.json"));

//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//your local database url
//27017 is the default mongoDB port
const uri = config.databaseURI;

console.log("getting here fine")

mongoose.connect(uri, {
    useNewUrlParser: true}).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log('Connected to Mongo');
        
    },
    err => {
         /** handle initial connection error */ 
         console.log('error connecting to Mongo: ')
         console.log(err);   
        }
  );


module.exports = mongoose.connection