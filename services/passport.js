const express=require('express');
const passport=require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
const request=require('request');
const keys=require('../config/keys');


passport.serializeUser(function(user,done){
  done(null,user);
});
passport.deserializeUser(function(obj,done){
   done(null,obj);
});

passport.use(new GitHubStrategy({
    clientID: keys.clientId,
    clientSecret: keys.clientSecret,
    callbackURL: "http://localhost:8080/auth/github/callback",
    auth_type:"reauthenticate"
  },
  function(accessToken, refreshToken, profile, done) {

    console.log('ACCESS_TOKEN',accessToken);
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
