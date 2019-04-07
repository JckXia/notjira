const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let CardSchema=new Schema({
   'card_state':{type:String,required:true,enum: ['toDo', 'inProg','Done']},
   'toDoItemTitle':{type:String},
   'toDoItemDetail':{type:String},
   'assignedTo':{type:Array}
});
module.exports=mongoose.model('Card',CardSchema);
