const express = require('express');
const router = express.Router()
const database = require('./db_functions');

router.get('/',(req,res) => {
    res.render('games/index')
})


module.exports = router