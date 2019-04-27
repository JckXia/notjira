const Task from '../models/task.model';

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
  return await Task.findOne({_id:taskId});
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
