const keys = require('../config/keys');
const User = require('../BackEnd/models/user.model');
var GitHubStrategy = require('passport-github2').Strategy;
const Octokit = require('@octokit/rest');
const request = require('superagent');
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
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
      callbackURL: "/auth/github/callback",
      auth_type: "reauthenticate"
    },
    async (accessToken, refreshToken, profile, done) => {
 
      const existingUser = await User.findOne({
        gitHubId: profile.id
      });

      if (existingUser) {

        const res = await User.findOneAndUpdate({
          gitHubId: profile.id
        }, {
          access_token: accessToken
        });

        const resultUser = await User.findOne({
          gitHubId: profile.id
        });
        //    console.log('EXIST ',existingUser);
        return done(null, resultUser);
      }

      const user = await new User({
        gitHubId: profile.id,
        token: accessToken
      }).save();
      console.log(user);
      //  console.log(user);
      done(null, user);
    }
  ));

}
