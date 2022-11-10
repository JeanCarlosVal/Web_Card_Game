const express = require('express');
const router = express.Router();
const User = require('../models/new_User');

router.get('/',(req,res) => {
    console.log(req.session)
    res.render('games/index')
})

router.get('/hilo', async (req, res) => {
    //get top 5 users by hilo score to export to leaderboard;
   let hiloLeaders = await User.find().sort({"hi_lo.wins" : -1}).limit(5);
   console.log(hiloLeaders);
    res.render('games/hilo', {leaders: hiloLeaders});
});

router.get('/poker', async (req,res) => {
    let pokerLeaders = await User.find().sort({"poker.wins" : -1}).limit(5);
})

router.get('/poker-leaders', async (req, res) => {
    let pokerLeaders = await User.find().sort({"poker.wins" : -1}).limit(5);
    console.log(pokerLeaders);
    res.render('games/poker-leaders.ejs', {leaders: pokerLeaders});

});

module.exports = router;