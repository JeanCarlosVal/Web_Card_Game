const express = require('express')
const new_User = require('../models/new_User')
const router = express.Router()

router.get('/',(req,res) => {
    res.render('index')
})

router.get('/sign_in', (req,res) => {
    res.render('sign_in')
})

router.get('/sign_up', (req,res) => {
    res.render('sign_up')
})

router.post('/sign_up', async (req,res) => {
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth
    })

    try{
        const newUser =  await user.save()
        res.redirect('/sign_in')
    } catch {
        res.render('/sign_up', {
            user: user,
            errorMessae: 'Error creating new user'
        })
    }
})

module.exports = router