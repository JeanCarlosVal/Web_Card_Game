const mongoose = require('mongoose')

const newUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

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
    },
    wins: {
        type: Number,
        required: false
    },
    losses: {
        type: Number,
        required: false,
    }
})



const user_model = mongoose.model('User',newUserSchema);
module.exports = user_model;