const { application } = require('express');
const express = require('express');
//const app = express();
const { Session } = require('express-session');
const { exists, findOneAndUpdate } = require('../models/new_User');
const User = require('../models/new_User')
const router = express.Router()
//app.use(express.json());

var session;
var authenticated;

router.get('/',(req,res) => {

    res.render('index');
})

router.get('/sign_in', (req,res) => {
    res.render('sign_in')
})

router.get('/sign_up', (req,res) => {
    res.render('sign_up', { user: new User() })
})

router.get('/profile', (req,res) => {

    //if user has logged in and session isn't expired, they can view profile
    if(authenticated){
    res.render('profile', {user: session.user});
    }
    //otherwise they are redirected to the sign in page
    else{
        res.render('sign_in',{errorMessage: "log in to access profile!"});
    }
});

router.get('/goodbye', (req, res) => {
    res.render('goodbye');
})

router.post('/sign_up', async (req,res) => {

    session = req.session;
    console.log(req.sessionID);

    //check if account exists using username, if it does then error message on html form is displayed
    const accountExists = await User.exists({username: req.body.username})
        if(accountExists) {
            res.render('sign_up', {
                user: user,
                errorMessage: 'Username ' + req.body.username + ' already exists!'
            })
        }

    //otherwise new user is created
     var user = new User({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth,
        wins: 0,
        losses: 0,
        games_played: 0,
        hi_lo: {
            wins: 0,
            losses: 0,
        }
        });

        try{
            //add sessionID to user document, then save new user document to database
            await Object.assign(user, {sessionID: req.sessionID}).save();
            
            //profile will be the user data made available (session.user) to display to client side, sans password
            var profile = user;
            profile.password = undefined;
            session.user = profile;
            console.log(session.user)
            authenticated=true;
            res.redirect('/profile');

        } catch {
            //not all fields were filled in on signup
            res.render('sign_up', {
                user: user,
                errorMessage: 'Error creating new user'
            })
        }
})

router.post('/sign_in', async (req, res) => {
    session = req.session;

    //log user in by refreshing their sessionID with the current one
    const user = await User.findOneAndUpdate(  {
        "username": req.body.username,
        "password": req.body.password
    },
        {
        $set: {
            sessionID: req.sessionID
            }
        },
    );

    //if profile didn't exist, then user notified credentials were incorrect
    if(!user) {
        res.render('sign_in', {
            errorMessage: 'Username or password is incorrect'
        })
    }
    
    else {
        //profile will be user data rendered client side, sans password
        const profile = user;
        profile.password = undefined;

        //attach user info to session/cookie, then redirect to profile page
        session.user = profile;
        authenticated=true;
        res.redirect('/profile');
    }
});

router.post('/delete_profile', async (req, res) => {
    //find profile that user entered 
    var toDelete = await User.findOne({username: req.body.username, password: req.body.password });

    //if its sessionID matches the one they are logged into, then the profile is deleted, otherwise user sent back to profile page
    try{
        if (toDelete.sessionID === req.sessionID) {
            await User.deleteOne({username: req.body.username});
                authenticated = false;
                res.redirect('/goodbye');
         }
         
    } catch{
         res.render('profile', {user: session.user, errorMessage: "credentials incorrect, cannot delete account!"});
    }
});


router.post('/edit_account', async(req,res) => {
    //setting new to true will return profile after it's been updated
    const opts = {new: true};

    //if new password and confirm password match, then change profile info
    if(req.body.password === req.body.password_confirm) {
        var updatedAccount = await User.findOneAndUpdate (
        {
            //find user's profile using sessionID
            "sessionID": req.sessionID
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

router.post('/logout', (req, res) => {
     if(req.session) {
        req.session.destroy( ()=> {
            authenticated = false;
            console.log('logout successful')
        });
    }
    res.redirect('/');
})

//endpoint to update user game stats when games end 
router.post('/game_results', async (req, res) => {
    let obj = req.body;
    let result_field;
    let game = obj.game;
    (obj.wins == 1) ? result_field = "wins" : result_field = "losses";

    //string for game/win-loss field of user
    let game_result = [game] + "." + [result_field];
    console.log(result_field);
    console.log(game_result);

      const opts = {new: true};
          var updatedAccount = await User.findOneAndUpdate (
          {
              //find user's profile using sessionID
              "sessionID": obj.sessionID
          },

              {
                //increment total wins, the user's game win/loss tally, and total games played 
              $inc: {
                  [result_field]: 1,
                  [game_result]: 1,
                  games_played: 1
                  }
                }
              ,
              opts
          )
  
          //update the cookie's user info to reflect the new user info, then redirect back to /profile
          //session.user = updatedAccount;
          console.log(updatedAccount)
          res.redirect('/profile');
            });

module.exports = router;