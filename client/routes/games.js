const express = require('express');
const User = require('../models/new_User');
const router = express.Router()

router.get('/',(req,res) => {

    console.log(req.session)
    res.render('games/index')
})

router.get('/hilo', async (req, res) => {
    //get all users
   let userList = await User.find({});
   console.log(userList);

    res.render('games/hilo');
});

router.get('/poker', (req,res) => {
    res.render('games/poker')
})


module.exports = router;