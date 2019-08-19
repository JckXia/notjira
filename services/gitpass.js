const keys = require('../config/keys');
const User = require('../BackEnd/models/user.model');
var GitHubStrategy = require('passport-github2').Strategy;
const request = require('superagent');
const Octokit = require('@octokit/rest');
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
      done(null,user.id);
  });

  passport.deserializeUser(function(id, done) {

    User.findById(id).then(user => {
      done(null, user);
    });
  });

  passport.use(new GitHubStrategy({
      clientID: keys.gitClientId,
      clientSecret: keys.gitClientSecret,
      callbackURL: "/auth/github/callback",
      auth_type: "reauthenticate",
      allow_signup:true
    },
    async (accessToken, refreshToken, profile, done) => {

        console.log('Access tok ',accessToken);
      const existingUser = await User.findOne({
        gitHubId: profile.id
      });

      if (existingUser) {

        const res = await User.findOneAndUpdate({
          gitHubId: profile.id
        }, {
          token: accessToken
        });

        const resultUser = await User.findOne({
          gitHubId: profile.id
        });
        //    console.log('EXIST ',existingUser);
        return done(null, resultUser);
      }

      let userInfo=await request.get('https://api.github.com/user/'+profile.id);
      userInfo=JSON.stringify(userInfo);
      userInfo=JSON.parse(userInfo);
      userInfo=userInfo.text;
      userInfo=JSON.parse(userInfo);
      const user = await new User({
        gitHubId: profile.id,
        username:userInfo.login,
        token: accessToken
      }).save();
      console.log(user);
      //  console.log(user);
      done(null, user);
    }
  ));

}
