const express = require('express');
const router = express.Router()

router.get('/',(req,res) => {

    console.log(req.session)
    res.render('games/index')
})

router.get('/hilo', (req, res) => {
    res.render('games/hilo');
})

router.get('/poker', (req,res) => {
    res.render('games/poker')
})

module.exports = router