const mongoose = require('mongoose')

const newUserSchema = new mongoose.Schema({
    First_name: {
        type: String,
        required: true
    },
    Last_name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Date_of_birth: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('User',newUserSchema)