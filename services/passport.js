const express = require('express');
const passport = require('passport');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');
const keys = require('../config/keys');
const User = require('../BackEnd/models/user.model');

console.log('Passport get runs');
passport.serializeUser(function(user, done) {
  console.log(user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GitHubStrategy({
    clientID: keys.clientId,
    clientSecret: keys.clientSecret,
    callbackURL: "http://localhost:8080/auth/github/callback",
    auth_type: "reauthenticate"
  },
  async (accessToken, refreshToken, profile, done) => {

    console.log('ACCESS_TOKEN', accessToken);

    const existingUser = await User.findOne({
      gitHubId: profile.id
    });

    if (existingUser) {
        return done(null,existingUser);
    }
    const user=await new User({
      gitHubId:profile.id
    }).save();
    console.log(user);
    done(null,user);
  }
));
