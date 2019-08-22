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
const user=require('./routes/user.route');
const github=require('./routes/github.route');
const auth=require('./routes/auth.route');
const keys = require('../config/keys');
var proxy = require('http-proxy-middleware')
//Connect to mongoose and monogdb
let dev_db_url= process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/JiraBackEnd";

app.use(express.static('../jirafront/build'));

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
//app.use('/project',project);
app.use('/user',user);
//app.use('/card',card);
app.use('/',github);
app.use('/',auth);

if(process.env.NODE_ENV == "production"){
  console.log('Loading files that are needed in prod');
app.get('*', (req, res) => {
  res.sendFile(path.resolve('../jirafront/build/index.html'));
});
}


// Listen on port 3000 or process environment port for AWS deployments
let port=process.env.PORT || 8080;



app.listen(port,()=>{
  console.log('Application is upn and running on port ',port);
});
