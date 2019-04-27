const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let TaskSchema=new Schema({
   'task_state':{type:String,required:true,enum: ['toDo', 'inProg','Done']},
   'taskTitle':{type:String},
   'taskDetail':{type:String},
   'assignedTo':{type:Array},
   'branch':{type:String},
   'pullRequest':{type:String}
});
module.exports=mongoose.model('Task',CardSchema);
