const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const User = require('../models/new_User');

router.get('/',(req,res) => {
    console.log(req.session)
    res.render('games/index')
})
=======

router.get('/',(req,res) => {
    console.log(req.session);
    res.render('games/index');
});
>>>>>>> slap

router.get('/hilo',(req, res) => {
    res.render('games/hilo');
});
<<<<<<< HEAD

router.get('/poker',(req,res) => {
    res.render('games/poker');
})

module.exports = router;
=======

router.get('/poker', (req,res) => {
    res.render('games/poker')
})

router.get('/slap', (req,res) => {
    res.render('games/slap')
})

module.exports = router
>>>>>>> slap
