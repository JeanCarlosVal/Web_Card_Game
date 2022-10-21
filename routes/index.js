const express = require('express');
const { exists, findOneAndUpdate } = require('../models/new_User');
const User = require('../models/new_User')
const router = express.Router()
const database = require('./db_functions');

var session;

router.get('/',(req,res) => {
    res.render('index');
})

router.get('/goodbye', (req, res) => {
    res.render('goodbye');
})

router.get('/sign_in', (req,res) => {
    res.render('sign_in')
})

router.get('/sign_up', (req,res) => {
    res.render('sign_up', { user: new User() })
})

router.get('/profile', (req,res) => {
    //if user has logged in and cookie isn't expired, they can view profile
    try {
    res.render('profile', {user: session.user});
    }
    //otherwise they are redirected to the sign in page
    catch{
        res.render('sign_in',{errorMessage: "log in to access profile!"});
    }
});


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
            
            //assign session to this new user and render their new profile
            session = req.session;
            session.user = newUser;
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
        session = req.session 
        const user = {
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name,
            date_of_birth: profile.date_of_birth,
            wins: 0,
            losses: 0
        }

        //attach user info to session/cookie, 
        session.user = profile;

        console.log('login successful');
        console.log(session.user.username);
        res.redirect('/profile');
    }
});

router.post('/delete_profile', async (req, res) => {
    //find profile that user entered 
    var toDelete = await User.findOne({username: req.body.username, password: req.body.password });

    //if its id matches the one they are logged into, then the profile is deleted
    try{
    if (toDelete._id.equals(session.user._id)) {
        await User.deleteOne({username: req.body.username});
            res.redirect('/goodbye');
    }
}
//otherwise send back to profile page
catch{
    res.render('profile', {user: session.user, errorMessage: "credentials incorrect, cannot delete account!"});
}

});

router.post('/edit_account', async(req,res) => {

    //setting new to true will return new profile after it's been updated
    const opts = {new: true};

    //if new password and confirm password match, then change profile info
    if(req.body.password === req.body.password_confirm) {
        var updatedAccount = await User.findOneAndUpdate (
        {
            //find user's profile using _id/ObjectId
            "_id": session.user._id
        },
            {
            $set: {
                username: req.body.username,
                password: req.body.password
                }
            },
            opts
        )

        //update the cookie's user info to reflect the new user info, then redirect back to /profile
        session.user = updatedAccount;
        res.redirect('/profile');
        }
        else(res.render('profile', {user: session.user}));
    });

module.exports = router;
