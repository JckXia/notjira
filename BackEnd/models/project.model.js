const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let ProjectSchema=new Schema({
  'project_name':{type:String,required:true}, //Every user must have a user name
  'project_admin_pk':{type:String}, //This password is stored in database upon encryption
  'project_admin_userName':{type:Array},
  'project_participants':{type:Array},
  'project_creation_date':{type:String},
  'project_cards':{type:Array}
});
module.exports=mongoose.model('Project',ProjectSchema);
