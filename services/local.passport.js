const express = require('express');
const passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../BackEnd/models/user.model');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

console.log(LocalStrategy);
passport.use(new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  session:false
},async (username,password,done)=>{

   console.log(username);
   console.log(password);
}));
