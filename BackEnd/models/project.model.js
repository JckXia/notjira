const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let ProjectSchema=new Schema({
  'repo_name':{type:String,required:true},
  'repo_owner_name':{type:String,required:true}, //Every user must have a user name
  'project_admin_pk':{type:String,required:true}, //This password is stored in database upon encryption
  'project_admin_userName':{type:String,required:true},
  'project_participants':{type:Array},
  'project_creation_date':{type:String},
  'project_cards':{type:Array}
});
module.exports=mongoose.model('Project',ProjectSchema);
