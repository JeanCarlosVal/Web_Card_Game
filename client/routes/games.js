const express = require('express');
const router = express.Router();
const User = require('../models/new_User');

router.get('/',(req,res) => {
    console.log(req.session)
    res.render('games/index')
})

router.get('/hilo',(req, res) => {
    res.render('games/hilo');
});

router.get('/poker',(req,res) => {
    res.render('games/poker');
})

router.get('/war', (req, res) => {
    res.render('games/war');
})

module.exports = router;