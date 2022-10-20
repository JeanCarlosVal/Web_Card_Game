const express = require('express');
const { exists } = require('../models/new_User');
const User = require('../models/new_User')
const router = express.Router()
const database = require('./db_functions');

router.get('/',(req,res) => {
    res.render('index');
})

router.get('/sign_in', (req,res) => {
    res.render('sign_in')
})

router.get('/sign_up', (req,res) => {
    res.render('sign_up', { user: new User() })
})


router.post('/sign_up', async (req,res) => {

    //check if account exists using username, if it does then error message on html form is displayed
    const accountExists = await User.exists({username: req.body.username})

     const user = new User({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth,
        wins: 0,
        losses: 0
        });

        //if the account already exists user is notified so they can try again
    if(accountExists) {
        res.render('sign_up', {
            user: user,
            errorMessage: 'Username ' + req.body.username + ' already exists!'
        })

    }

    else {

        try{
            console.log(user)
            const newUser =  await user.save()
            res.render('profile', {user: user});
        } catch {
            res.render('sign_up', {
                user: user,
                errorMessage: 'Error creating new user'
            })
        }
}
})


//handling requests to sign in
router.post('/sign_in', async (req, res) => {
    
    //checks if profile exists, if it does then it returns the profile
    [loginValid, profile] = await database.validateLogin(req.body.username, req.body.password);
    console.log(profile);

    //if profile didn't exist, then user notified credentials were incorrect
    if(!loginValid) {
        res.render('sign_in', {
            errorMessage: 'Username or password is incorrect'
    })}

    //otherwise render their profile page with all profile info except their password
    else {
        const user = {
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name,
            date_of_birth: profile.date_of_birth,
            wins: 0,
            losses: 0
        }

        console.log(profile);
        console.log('login successful');
        res.render('profile', {user: user});
    }
});

router.post('/delete_account', async (req, res) => {
const toDelete = await User.findOne({username: req.body.username, password: req.body.password });
console.log(req.body.username)
if(toDelete) {
    await User.deleteOne({username: req.body.username});
    res.redirect('/');
}
else {
    res.redirect('back');
}
});


module.exports = router