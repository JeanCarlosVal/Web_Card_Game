const express = require('express');
const router = express.Router()
const database = require('./db_functions');

router.get('/',(req,res) => {
    res.render('games/index')
})

router.get('/poker', (req,res) => {
    res.render('games/poker')
})

module.exports = router