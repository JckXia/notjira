const express=require('express');
const bodyParser=require('body-parser');
const app=express();
var session = require('express-session');
const cookieSession=require('cookie-session');
const mongoose=require('mongoose');
const passport=require('passport');
const MongoClient=require('mongodb').MongoClient;
var GitHubStrategy = require('passport-github2').Strategy;
const User=require('./models/user.model');
//Import routes
const project=require('./routes/project.route');
const user=require('./routes/user.route');
const card=require('./routes/card.route');
const github=require('./routes/github.route');
const auth=require('./routes/auth.route');
const keys = require('../config/keys');
//Connect to mongoose and monogdb
let dev_db_url="mongodb://127.0.0.1:27017/JiraBackEnd";

mongoose.connect(dev_db_url,{useNewUrlParser:true},function(err,db){
   if(err){
     throw err;
   }
   console.log('Mongoose successfully connected to database');
});

mongoose.Promise=global.Promise;

MongoClient.connect(dev_db_url,{useNewUrlParser:true},function(err,db){
  if(err){
    throw err;
  }
  console.log('Mongodb is running on port',db.topology.s.port);
});

console.log('Running passport related functions');

/*
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
    callbackURL: "/auth/github/callback",
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
*/
require('../services/gitpass')(passport);
app.use(
  cookieSession({
    maxAge:30*24*60*60*1000,
    keys:['indasjdNSd421$SDssssma$s']
  })
);

//app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// --------------------------------------------- //


//Use body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/project',project);
app.use('/user',user);
app.use('/card',card);
app.use('/github',github);
app.use('/',auth);


// Listen on port 3000 or process environment port for AWS deployments
let port=8080||process.env.PORT;

app.listen(port,()=>{
  console.log('Application is upn and running on port ',port);
});
