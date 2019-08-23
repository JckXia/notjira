const Project = require('../models/project.model');


//A call will be in the controller
//These functions will be storing the data
//that is returned from the call

//Get the creator/admin of the repo
/*
Project :{
  name:gitDemo,
  admin:JckXia,
  adminPk:1234
  collaborators:[],
  tasks:[]
}
*/

//This function retrieves the pk of the project admin, as well as the name from the database
async function getProject(projectId) {
  const project = Project.findOne({
    _id: projectId
  });
  return project;
}

async function getProjectAdminInfo(projectId) {
  const project = await getProject(projectId);
  const adminInformationObject = {
    adminName: project.adminName,
    adminPk: project.adminPk
  }
  return adminInformationObject;
}
//Returns the project collaborators from the project by projectId
async function getProjectCollaborators(projectId) {
  const project = await getProject(projectId);
  return project.collaborators;
}


//Add a project collaborator.
//Collaborator is of mongoose object user
async function addProjectCollaborators(projectId, collaborator) {
  const res = await Project.findOneAndUpdate({
    _id: projectId
  }, {
    $push: {
      collaborators: collaborator
    }
  });

  const updateProject = await getProject(projectId);
  return updateProject;
}

//add a new project to the databse
async function saveNewProjectToDataBase(projectName, projectAdminName, projectAdminPk, collaborators, tasks) {
  const newProject=await new Project({
    repo_name:projectName,
    repo_owner_name:projectAdminName,
    project_admin_pk:projectAdminPk,
    project_admin_userName:projectAdminName,
    project_creator_name:projectAdminName,
    project_creator_pk:projectAdminPk,
    project_participants:collaborators,
    project_cards:tasks
  }).save();
  return newProject;
}

//Delte a project from the database
async function deleteProjectFromDataBase(projectId) {
  const status=await Project.deleteOne({_id:projectId});
  return status;
}

//Add a task to the projects
//TaskObject is of mongoose object task
async function addTaskToProject(projectId,TaskObject) {
  const res = await Project.findOneAndUpdate({
    _id: projectId
  }, {
    $push: {
      project_cards: TaskObject
    }
  });

  const updateProject = await getProject(projectId);
  return updateProject;
}

/*
Returns the id of a project by name
*/
async function getProjectId(projectName) {
  const project=Project.findOne({repo_name:projectName});
  return project.id;
}

/*
  Return all tasks from project
*/
async function getTasksFromProject(projectId) {
  const project=getProject(projectId);
  return project.project_cards;
}
