const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const userSchema = new Schema({
    username: { type: String, unique: true, required: true},
    email: { type: String, unique: true, required: true},
    password: { type: String, unique: false, required: true},
    teamsNBA: {type: Array, unique: false, required: true, default: []},
    teamsNFL: {type: Array, unique: false, required: true, default: []},
    teamsMLB: {type: Array, unique: false, required: true, default: []}
}, { collection: "User"})

// Define schema methods
userSchema.methods = {}


const User = mongoose.model('User', userSchema)
module.exports = User