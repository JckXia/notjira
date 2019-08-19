const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let UserSchema=new Schema({
  'gitHubId':{type:String},
  'username':{type:String}, //Every user must have a user name
  'password':{type:String}, //This password is stored in database upon encryption
  'repo_lists':{type:Array},
  'token':{type:String}  //SSO token consistutes password
});

module.exports=mongoose.model('User',UserSchema);
