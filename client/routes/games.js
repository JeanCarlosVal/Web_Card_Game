const express = require('express');
const router = express.Router();
const User = require('../models/new_User');

router.get('/',(req,res) => {
    console.log(req.session)
    res.render('games/index')
})

router.get('/hilo', async (req, res) => {
    res.render('games/hilo');
});

router.get('/poker', async (req,res) => {
    res.render('games/poker');
})

module.exports = router;