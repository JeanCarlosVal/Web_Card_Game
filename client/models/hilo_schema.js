const mongoose = require('mongoose');

const hiloSchema = new mongoose.Schema({
    wins:  {
        type: Number,
        required: false
    },
    losses: {
        type: Number,
        required: false
    }
})

const hilo_model = mongoose.model('Hilo',hiloSchema);
module.exports = hilo_model;