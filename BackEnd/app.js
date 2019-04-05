const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const mongoose=require('mongoose');
const MongoClient=require('mongodb').MongoClient;

//Import routes
const project=require('./routes/project.route');
const user=require('./routes/user.route');
const card=require('./routes/card.route');
const github=require('./routes/github.route');
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

// --------------------------------------------- //

//Use body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/project',project);
app.use('/user',user);
app.use('/card',card);
app.use('/github',github);

// Listen on port 3000 or process environment port for AWS deployments
let port=3000||process.env.PORT;

app.listen(port,()=>{
  console.log('Application is upn and running on port ',port);
});
