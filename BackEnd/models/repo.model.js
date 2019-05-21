const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let RepoSchema=new Schema({
  'repo_name':{type:String,required:true},//Every user must have a user name
  'repo_admin_pk':{type:String,required:true}, //This password is stored in database upon encryption
  'repo_admin_userName':{type:String,required:true},
  'repo_creator_name':{type:String},
  'repo_creator_pk':{type:String},
  'repo_collaborators':{type:Array},
  'repo_creation_date':{type:String},
  'repo_web_hook':{type:String},
  'taskItems':{type:Array},
  'date_created':{type:String},
  'repo_html_url':{type:String}
});
module.exports=mongoose.model('Repo',RepoSchema);
