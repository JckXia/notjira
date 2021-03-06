const Task = require("../models/task.model");
const ObjectID = require("mongodb").ObjectID;
const TASK_STATE = require("../util/validTaskState");

async function createTaskObject(taskTitle, taskDetail) {
  const newTask = await new Task({
    taskTitle: taskTitle,
    taskDetail: taskDetail
  }).save();

  return newTask;
}

function taskStateIsValid(taskState) {
  let retVal = false;
  for (let i in TASK_STATE) {
    if (TASK_STATE[i] === taskState) {
      retVal = true;
    }
  }

  return retVal;
}

//Collaborator is of type user
async function assignTaskToCollaborator(taskId, collaborator) {
  const res = await Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      $push: {
        assignedTo: collaborator
      }
    }
  );

  const newCard = await Task.findOne({ _id: taskId });
  return newCard;
}

/*
branchObject is of type object that contains the following information
 {
 sha_ref:'12341cxas',
 branchname:'Steve'
}
*/
async function createBranchForTask(taskId, branchObject) {
  const res = await Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      branch: branchObject
    }
  );

  const updatedTask = await Task.findOne({ _id: taskId });
  return updatedTask;
}

async function findTaskById(taskId) {
  taskId = new ObjectID(taskId);
  return await Task.findOne({ _id: taskId });
}

async function updateTaskStatus(taskId, taskStatus) {
  taskId = new ObjectID(taskId);
  const updatedTaskObject = await Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      $set: {
        task_state: taskStatus
      }
    },
    { new: true }
  );
  return updatedTaskObject;
}

async function createPullReuquestForTask(taskId, pullRequest) {
  await Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      pullRequest: pullRequest
    }
  );
  const updatedTask = await Task.findOne({ _id: taskId });
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
async function addGitBranchToTask(
  branchRefData,
  parentRefData,
  parentBranchName,
  taskId
) {
  const refName = branchRefData.refName;
  const gitBranchData = {
    branchRefData,
    refName,
    parentRefData,
    parentBranchName
  };
  console.log(taskId);
  const updateResult = await Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      $push: {
        branch: gitBranchData
      }
    },
    { new: true, rawResult: true }
  );

  return updateResult;
}

async function addGitBranchRefToTaskRecord(taskId, gitBranchRefId) {
  const updateResult = await Task.findOneAndUpdate(
    {
      _id: taskId
    },
    {
      $push: {
        branch: gitBranchRefId
      }
    },
    { new: true, rawResult: true }
  );
  return updateResult;
}

async function removeTaskRecord(taskId) {
  const removeTaskResponse = await Task.findOneAndRemove({
    _id: taskId
  });
  return removeTaskResponse;
}

async function removeTask(req, res) {
  const taskId = req.body.taskId;
  const removeResult = await Task.findOneAndDelete(
    {
      _id: taskId
    },
    { rawResult: true }
  );
  return removeResult;
}

async function removeGitBranchIdFromTask(branchId, taskId) {
  const updateResult = await Task.findOneAndUpdate(
    {
      _id: new ObjectID(taskId)
    },
    {
      $pull: {
        branch: branchId
      }
    },
    { new: true, rawResult: true }
  );
  return updateResult;
}
async function removeGitBranchFromTask(branchRefName, taskId) {
  const updateResult = await Task.findOneAndUpdate(
    {
      _id: new ObjectID(taskId)
    },
    {
      $pull: {
        branch: {
          refName: branchRefName
        }
      }
    },
    { new: true, rawResult: true }
  );
  return updateResult;
}

async function addPullRequestToTask(pullRequestTitle, pullRequestUrl, taskId) {
  const pullRequestDataObject = { pullRequestTitle, pullRequestUrl, taskId };

  const updateResult = await Task.findOneAndUpdate(
    {
      _id: new ObjectID(taskId)
    },
    {
      $push: {
        pullRequest: pullRequestDataObject
      }
    },
    { new: true, rawResult: true }
  );

  return updateResult;
}

module.exports = {
  addGitBranchRefToTaskRecord,
  addGitBranchToTask,
  findTaskById,
  removeTask,
  taskStateIsValid,
  removeTaskRecord,
  updateTaskStatus,
  removeGitBranchFromTask,
  removeGitBranchIdFromTask,
  addPullRequestToTask
};
