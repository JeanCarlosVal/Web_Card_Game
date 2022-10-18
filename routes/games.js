const express = require('express');
const router = express.Router()
const database = require('./db_functions');

router.get('/',(req,res) => {
    res.render('games/index')
})

router.get('/hilo', (req, res) => {
    console.log(req.url);
    res.render('games/hilo');
})


module.exports = router