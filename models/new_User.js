const mongoose = require('mongoose')

const newUserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: false
    }
})

module.exports = mongoose.model('User',newUserSchema)