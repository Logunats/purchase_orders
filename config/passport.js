var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CryptoJS = require('crypto-js');
const user = require('../models/user.model');
const connection= require('./db-connect');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        console.log("passport", user)
        done(null, user.tnus_id)
    })

    passport.deserializeUser((id, done) => {
        user.findById(id, (err, emp) => {
            if(err){
                console.log('Error deserializeUser', err)
                done(err, null)
            } else {
                done(null, emp)
            }
        })
    })

// =====================================================================
// LOCAL-LOGIN USING PASSPORT
// =====================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        var checkPassword = CryptoJS.SHA256(password).toString();
        user.validateLogin(email, checkPassword, (err, rows) => {
            if(err){
                console.log("Validate Login Error", err)
                // return done(null, err, req.flash("danger", "User not Found"))
                return done(err)
                // return done(err, false, { message: 'Invalid login credentials.' })
            } else if(rows) {
                return done(null, rows[0])
            } else {
                // req.flash('danger', 'Invalid User ID/Password')
                return done(null, false)
            }
        })
    }));
}
