const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let TaskSchema=new Schema({
   'task_state':{type:String,required:true,enum: ['toDo', 'inProg','Done']},
   'toDoItemTitle':{type:String},
   'toDoItemDetail':{type:String},
   'assignedTo':{type:Array},
   'Branch':{type:String},
   'PullRequest':{type:String}
});
module.exports=mongoose.model('Task',CardSchema);
