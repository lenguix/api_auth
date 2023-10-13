const mongoose = require("mongoose")

const UsersAuth = mongoose.model('User_Auth', {
    email: {type: String, required: true, minLength: 5},
    password: {type: String, required: true},
    salt: {type: String, required: true},
})

module.exports = UsersAuth