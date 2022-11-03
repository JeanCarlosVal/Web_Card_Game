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
    },
    games_played: {
        type: Number,
        required: false
    },

    hi_lo: {
        wins: Number, 
        required: false,
        losses: Number,
        required: false
    },
    sessionID: {
        type: String,
        required: false
    }
})



const user_model = mongoose.model('Accounts',newUserSchema);
module.exports = user_model;