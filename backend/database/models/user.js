const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const userSchema = new Schema({
    username: { type: String, unique: true, required: true},
    email: { type: String, unique: true, required: true},
    password: { type: String, unique: false, required: true},
    favoriteTeams: {
        NBA: {type: Array, unique: false, required: true, default: []},
        NFL: {type: Array, unique: false, required: true, default: []},
        MLB: {type: Array, unique: false, required: true, default: []}
    }
}, { collection: "User"})

// Define schema methods
userSchema.methods = {}


const User = mongoose.model('User', userSchema)
module.exports = User