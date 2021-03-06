const Repo = require("../models/repo.model");
const Task = require("../models/task.model");
const ObjectID = require("mongodb").ObjectID;
//A call will be in the controller
//These functions will be storing the data
//that is returned from the call

//Get the creator/admin of the repo
/*
Repo :{
  name:gitDemo,
  admin:JckXia,
  adminPk:1234
  collaborators:[],
  tasks:[]
}
*/

//This function retrieves the pk of the repo admin, as well as the name from the database
async function getRepoById(repoId) {
  const repo = await Repo.findOne({
    _id: repoId
  });
  return repo;
}

async function getRepoByName(repoName) {
  console.log(repoName);
  const repo = await Repo.findOne({
    repo_name: repoName
  });
  return repo;
}

function hasAdminAccess(repoObject, userId) {
  if (
    repoObject.repo_admin_pk !== userId &&
    repoObject.repo_creator_pk !== userId
  ) {
    return false;
  }
  return true;
}
async function userIsAdminOfRepo(userId, repoName) {
  const repo = await getRepoByName(repoName);
  console.log(userId);
  const adminInfo = await getRepoAdminInfo(repo.id);
  console.log(adminInfo);
  if (userId == adminInfo.adminPk) {
    return true;
  }
  return false;
}

async function userIsCollaboratorOfRepo(userId, repoName) {
  const repo = await getRepoByName(repoName);
  const collaborators = await getRepoCollaborators(repo.id);
  if (collaborators == null) {
    return false;
  }
  const collaboratorCount = collaborators.length;
  for (let i = 0; i < collaboratorCount; i++) {
    if (collaborators[i].id == userId) {
      return true;
    }
  }
  return false;
}

async function getRepoAdminInfo(repoId) {
  const repo = await getRepoById(repoId);
  const adminInformationObject = {
    adminName: repo.repo_admin_userName,
    adminPk: repo.repo_admin_pk
  };
  return adminInformationObject;
}
//Returns the repo collaborators from the repo by repoId
async function getRepoCollaborators(repoId) {
  const repo = await getRepoById(repoId);
  return repo.repo_collaborators;
}

//Add a repo collaborator.
//Collaborator is of mongoose object user
async function addRepoCollaborators(repoId, collaborator) {
  const res = await Repo.findOneAndUpdate(
    {
      _id: repoId
    },
    {
      $push: {
        repo_collaborators: collaborator
      }
    }
  );

  const updateRepo = await getRepoById(repoId);
  return updateRepo;
}

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
//add a new repo to the databse
async function saveNewRepoToDataBase(
  repoName,
  repoAdminName,
  repoAdminPk,
  collaborators,
  tasks,
  webHookUrl,
  html_url
) {
  const newRepo = await new Repo({
    repo_name: repoName,
    repo_owner_name: repoAdminName,
    repo_admin_pk: repoAdminPk,
    repo_admin_userName: repoAdminName,
    repo_creator_name: repoAdminName,
    repo_creator_pk: repoAdminPk,
    repo_collaborators: collaborators,
    repo_web_hook: webHookUrl,
    taskItems: tasks,
    date_created: getDate(),
    repo_html_url: html_url
  }).save();
  return newRepo;
}

async function deleteRepoRecord(repoName) {
  try {
    const removedRepoObject = await Repo.findOneAndRemove({
      repo_name: repoName
    });
    return removedRepoObject;
  } catch (error) {
    throw error;
  }
}

//Delte a repo from the database
async function deleteRepoFromDataBase(repoId) {
  const removedObject = await Repo.findOneAndRemove({
    _id: repoId
  });
  console.log(removedObject);
  // const status = await Repo.deleteOne({
  //   _id: repoId
  // });
  return removedObject;
}
async function saveTaskRecordToRepo({
  task_state,
  task_name,
  task_desc,
  assigned_to,
  branch,
  pullRequest,
  parent_repo
}) {
  const newTaskObject = await new Task({
    task_state: task_state || "toDo",
    taskName: task_name,
    taskDesc: task_desc ? task_desc : "",
    assignedTo: assigned_to ? assigned_to : [],
    branch: [],
    pullRequest: [],
    repoName: parent_repo
  }).save();

  const basicTaskData = {
    taskName: task_name,
    taskDesc: task_desc,
    task_state: "toDo",
    _id: newTaskObject._id
  };
  try {
    const updateResult = await Repo.findOneAndUpdate(
      {
        repo_name: parent_repo
      },
      {
        $push: {
          taskItems: basicTaskData
        }
      }
    );
  } catch (err) {
    throw err;
  }
  return newTaskObject;
}

//Add a task to the repos
//TaskObject is of mongoose object task
async function addTaskToRepo(req, res) {
  const newTaskObject = await new Task({
    task_state: "toDo",
    taskName: req.body.taskName,
    taskDesc: req.body.taskDescription ? req.body.taskDescription : "",
    assignedTo: [],
    branch: [],
    pullRequest: [],
    repoName: req.params.repoName
  }).save();

  const basicTaskData = {
    taskName: req.body.taskName,
    taskDesc: req.body.taskDescription,
    task_state: "toDo",
    _id: newTaskObject._id
  };

  const updateResult = await Repo.findOneAndUpdate(
    {
      repo_name: req.params.repoName
    },
    {
      $push: {
        taskItems: basicTaskData
      }
    }
  );

  return newTaskObject;
  //  console.log(newTaskObject);
}

/*
Returns the id of a repo by name
*/
async function getRepoId(repoName) {
  const repo = Repo.findOne({
    repo_name: repoName
  });
  return repo.id;
}

/*
  Return all tasks from repo
*/
async function getTasksFromRepo(repoId) {
  const repo = getRepoById(repoId);
  return repo.repo_cards;
}

async function removeTaskFromRepo(taskId, repoName) {
  const result = await Repo.findOneAndUpdate(
    {
      repo_name: repoName
    },
    {
      $pull: {
        taskItems: {
          _id: new ObjectID(taskId)
        }
      }
    }
  );
  return result;
}

/*
db.getCollection('tasks').findOneAndUpdate({"_id" : new ObjectId("5d6966a17473091509f97a64")},{
      $pull:{
       branch:{
          branchData:{
              branchName:'ref/head/stuff'
           }
       }
    }
    }
)
*/
async function updateTaskStatusWithinRepo(taskId, repoName, status) {
  const result = await Repo.findOneAndUpdate(
    {
      repo_name: repoName,
      taskItems: { $elemMatch: { _id: new ObjectID(taskId) } }
    },
    {
      $set: {
        "taskItems.$.task_state": status
      }
    }
  );
}

module.exports = {
  getTasksFromRepo,
  getRepoId,
  addTaskToRepo,
  deleteRepoFromDataBase,
  saveNewRepoToDataBase,
  addRepoCollaborators,
  getRepoCollaborators,
  userIsCollaboratorOfRepo,
  saveTaskRecordToRepo,
  deleteRepoRecord,
  userIsAdminOfRepo,
  hasAdminAccess,
  getRepoById,
  getRepoByName,
  removeTaskFromRepo,
  updateTaskStatusWithinRepo
};
