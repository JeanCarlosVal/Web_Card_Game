const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    console.log(req.session);
    res.render('games/index');
});

router.get('/hilo',(req, res) => {
    res.render('games/hilo');
});

router.get('/poker', (req,res) => {
    res.render('games/poker')
})

router.get('/slap', (req,res) => {
    res.render('games/slap')
})
router.get('/war', (req, res) => {
    res.render('games/war');
})
router.get('/blackjack', (req, res) => {
    res.render('games/blackjack');
})

module.exports = router;
