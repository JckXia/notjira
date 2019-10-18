const Task =require('../models/task.model');
const ObjectID=require('mongodb').ObjectID;

async function createTaskObject(taskTitle,taskDetail){
  const newTask=await new Task({
    taskTitle:taskTitle,
    taskDetail:taskDetail
  }).save();

  return newTask;
}

//Collaborator is of type user
async function assignTaskToCollaborator(taskId,collaborator){
  const res = await Task.findOneAndUpdate({
    _id: taskId
  }, {
    $push: {
      assignedTo: collaborator
    }
  });

  const newCard=await Task.findOne({_id:taskId});
  return newCard;
}

/*
branchObject is of type object that contains the following information
 {
 sha_ref:'12341cxas',
 branchname:'Steve'
}
*/
async function createBranchForTask(taskId,branchObject){
  const res = await Task.findOneAndUpdate({
    _id: taskId
  }, {
      branch: branchObject
  });

  const updatedTask=await Task.findOne({_id:taskId});
  return updatedTask;
}

async function findTaskById(taskId){
  taskId=new ObjectID(taskId);
  return await Task.findOne({_id:taskId});
}

async function updateTaskStatus(taskId,taskStatus){
    taskId=new ObjectID(taskId);
    const res=await Task.findOneAndUpdate({
      _id:taskId
    },{
      $set:{
        task_state:taskStatus
      }
    });
}

async function createPullReuquestForTask(taskId,pullRequest){
await Task.findOneAndUpdate({
    _id: taskId
  }, {
      pullRequest: pullRequest
  });
  const updatedTask=await Task.findOne({_id:taskId});
  return updatedTask;
}

//Data we want to store
//1. Branch Name const u
//2. Branch that its referencing(sha)
//3. Branch name that its referencing(str)

//Data that is supplied:
// 1. Branch Name
//2. Task Id
//3. Branch name
//4. Branch HashVal
//5. Ref Branch name
//6. Ref Branch HashVal
async function addGitBranchToTask(branchRefData,parentRefData,parentBranchName,taskId){
  const refName=branchRefData.refName;
     const  gitBranchData={branchRefData,refName,parentRefData,parentBranchName};
     const updateResult = await Task.findOneAndUpdate({
       _id: taskId
     }, {
       $push: {
         branch: gitBranchData
       }
     } ,{new:true,rawResult:true});

     return updateResult;
}

async function removeTask(req,res){
    const taskId=req.body.taskId;
    const removeResult=await Task.findOneAndDelete({
      _id:taskId
    },{rawResult:true});
    return removeResult;
}


/*
db.getCollection('tasks').findOneAndUpdate({
    _id: new ObjectId("5d956d8daf5eaa4db097fccc")
    },{
       $pull:{
           branch:{
               refName:'refs/heads/feature/PLAT-2847-TRK'
               }
           }
       });
*/
async function removeGitBranchFromTask(branchRefName,taskId){

   const updateResult=await Task.findOneAndUpdate({
     _id:new ObjectID(taskId)
   },{
      $pull:{
        branch:{
          refName:branchRefName
        }
      }
   },{new:true,rawResult:true});
   return updateResult;
}

module.exports = {
  addGitBranchToTask,
  findTaskById,
  removeTask,
  updateTaskStatus,
  removeGitBranchFromTask
};
