const user = require('../models/new_User');
const mongoose = require('mongoose');
const user_model = require('../models/new_User');
const account = user_model;

/**
 * @param {user} requestor's username
 * @param {password} requestor's password
 * @returns user's profile and whether it exists, if it does not then profile is null in addition to exist = false
 */
 async function validateLogin(username, password) {
    const profile = await account.findOne({username: username, password: password}).exec();
    var exists = true;
    if(profile === null)
        exists = false;
    return [exists, profile];
}

exports.validateLogin = validateLogin;