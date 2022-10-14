const express = require('express');
const { exists } = require('../models/new_User');
const User = require('../models/new_User')
const router = express.Router()
const database = require('./db_functions');

router.get('/',(req,res) => {
    res.render('index')
})

router.get('/sign_in', (req,res) => {
    res.render('sign_in')
})

router.get('/sign_up', (req,res) => {
    res.render('sign_up', { user: new User() })
})

router.post('/sign_up', async (req,res) => {

    //check if account exists using username, if not then 'true' is returned as well as the user's profile
    accountExists = await database.validateUsername(req.body.username);

        const user = new User({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
            date_of_birth: req.body.date_of_birth,
            wins: 0,
            losses: 0
        });

    if(accountExists) {
        res.render('sign_up', {
            user: user,
            errorMessage: 'Username already exists!'
        })
    }

    else {
        try{
            console.log(user)
            const newUser =  await user.save()
            res.redirect('/')
        } catch {
            res.render('sign_up', {
                user: user,
                errorMessage: 'Error creating new user'
            })
        }
}

})


module.exports = router