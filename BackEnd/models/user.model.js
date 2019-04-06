const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let UserSchema=new Schema({
  'gitHubId':{type:String},
  'userName':{type:String}, //Every user must have a user name
  'password':{type:String}, //This password is stored in database upon encryption
  'project_lists':{type:Array},
  'SSO_TOKEN':{type:String}  //SSO token consistutes password
});

module.exports=mongoose.model('User',UserSchema);
