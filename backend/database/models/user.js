const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define userSchema
const userSchema = new Schema({
    username: { type: String, unique: true, required: true},
    email: { type: String, unique: true, required: true},
    password: { type: String, unique: false, required: true},
    resetPassword: {
        hash: { type: String, unique: false, required: false, default: ""},
        expireDate: {type: Date, unique: false, required: false, default: new Date()}
    },
    favoriteTeams: {
        NBA: {type: Array, unique: false, required: true, default: []},
        NFL: {type: Array, unique: false, required: true, default: []},
        MLB: {type: Array, unique: false, required: true, default: []},
        EPL: {type: Array, unique: false, required: true, default: []},
    },
    notifications: {
        email: { type: Boolean, unique: false, required: true, default: false},
        SMS: { type: Boolean, unique: false, required: true, default: false},
    },
    phoneNumber: {type: String, unique: false, required: false},
    hideSpoilers: { type: Boolean, unique: false, required: true, default: false},
    verify: { 
        email: {type: Boolean, unique: false, required: false, default: false},
        emailHash: { type: String, unique: false, required: false, default: ""},
    },
}, { collection: "User"})

// Define schema methods
userSchema.methods = {}


const User = mongoose.model('User', userSchema)
module.exports = User