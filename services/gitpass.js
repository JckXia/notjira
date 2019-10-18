const keys = require('../config/keys');
const User = require('../models/user.model');
var GitHubStrategy = require('passport-github2').Strategy;
const request = require('superagent');
const Octokit = require('@octokit/rest');
module.exports = function(passport) {
  passport.serializeUser(function(userObject, done) {
    //  console.log('INFO USER OBJECT ',user);
      done(null,userObject);
  });

  passport.deserializeUser(function(userObject, done) {

    const id=userObject.user.gitHubId;

    User.findOne({gitHubId:id}).then(user=>{

        user.accessToken=userObject.accessToken;
        done(null,user);
    });

  });

  passport.use(new GitHubStrategy({
      clientID: keys.gitClientId,
      clientSecret: keys.gitClientSecret,
      callbackURL: "/auth/github/callback",
      auth_type: "reauthenticate",
      proxy:true,
      allow_signup:true
    },
    async (accessToken, refreshToken, profile, done) => {

      const existingUser = await User.findOne({
        gitHubId: profile.id
      });

      if (existingUser) {

    
        const user = await User.findOne({
          gitHubId: profile.id
        });

        return done(null, {user,accessToken,refreshToken});
      }

      const user = await new User({
        gitHubId: profile.id,
        username:profile.username
      }).save();

      done(null, {user,accessToken,refreshToken});
    }
  ));
}
