const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let TaskSchema=new Schema({
   'task_state':{type:String,required:true,enum: ['toDo', 'inProg','Done']},
   'taskName':{type:String},
   'taskDesc':{type:String},
   'assignedTo':{type:Array},
   'branch':{type:Array},
   'pullRequest':{type:Array},
   'repoName':{type:String}
});

module.exports=mongoose.model('task',TaskSchema);
