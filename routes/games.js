const express = require('express');
const router = express.Router()

router.get('/',(req,res) => {

    console.log(req.session)
    res.render('games/index')
})

router.get('/hilo', (req, res) => {
    console.log(req.url);
    res.render('games/hilo');
})


module.exports = router