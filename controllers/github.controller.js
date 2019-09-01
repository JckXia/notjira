function randomIntFromInterval(min, max) // min and max included
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const authenticationManager = require('../manager/authentication.manager');
const projectManager = require('../manager/project.manager');
const repoManager = require('../manager/repo.manager');
const userManager = require('../manager/user.manager');
const taskManager=require('../manager/task.manager');
const EventSource = require('eventsource');
const Octokit = require('@octokit/rest');
const WebHooksApi = require('@octokit/webhooks');

module.exports = {

  //Create a repository
  createRepo: async (req, res) => {


    const Env = process.env.NODE_ENV;

    const userId = Env == 'test' ? req.headers.id : await authenticationManager.getAuthenticatedUserId(req, res);
    const proxyUrl = req.body.proxyUrl;
    if (userId == null) {
      return res.status(403).send('Forbidden! User not authenticated');
    }
    const authToken = Env == 'test' ? req.headers.user : req.user.token;

    const octokit = new Octokit({
      auth: `${authToken}`
    });
    const repoName = req.body.repoName;
    try {
      const repoCreationResp = await octokit.repos.createForAuthenticatedUser({
        name: repoName
      });

      console.log(repoCreationResp.data.html_url);
      const user = await userManager.getUserById(userId);

      const newRepo = await repoManager.saveNewRepoToDataBase(repoName, user.username, user.id, [], [], proxyUrl,repoCreationResp.data.html_url);

      // ------Attempting to create webhook-------------------------------- //


      await octokit.repos.createHook({
        owner: user.username,
        repo: repoName,
        config: {
          url: proxyUrl,
          content_type: 'json',
          secret: 'mysecret'
        },
        events: ['*']
      }).then((res) => {

      }).catch((e) => {
        console.log('ERROR',e);
      });

     require('../services/githubWebHooks/webHookListener.js')(proxyUrl);

      //--------------------------------------------------------------------------------- //
      await userManager.addRepoToUserProfile(newRepo.id, newRepo.repo_name, user.username, proxyUrl,repoCreationResp.data.html_url,user.username);
      return res.status(201).send(newRepo);
    } catch (e) {

      return res.status(e.status).send('Error! ' + e);
    }

  },
  deleteRepo: async (req, res) => {

    //We need to check for the permission level
    //If user is creator of the repo, delete
    //else, return 403 forbidden
    //When repo is deleted
    // -Delete repo from db
    // -Delete repo from user list
    // -Delete user cards
    const Env = process.env.NODE_ENV;
    const userId = Env == 'test' ? req.headers.id : await authenticationManager.getAuthenticatedUserId(req, res);

    if (userId == null) {
      return res.status(403).send('Forbidden');
    }
    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName)) {

      const authToken = Env == 'test' ? req.headers.user : req.user.token;
      const octokit = new Octokit({
        auth: `${authToken}`
      });
      const repo = await repoManager.getRepoByName(req.params.repoName);

      const repoDeletion = await octokit.repos.delete({
        owner: repo.repo_creator_name,
        repo: repo.repo_name
      });

      //Remove repo from databse
      const removeRepoFromDb = await repoManager.deleteRepoFromDataBase(repo.id);

      // TODO:Add a way to delete the cards
      const removeRepoFromUserProfile = await userManager.removeRepoFromUserProfile(repo.id, repo.repo_name, repo.repo_creator_name);

      //Remove this repo from the user's id
      return res.status(200).send('Good');
    } else {
      return res.status(403).send('Forbidden');
    }


  },
  // api/github/:ownerName/:repoName/webhook/create
  //body:
  // Url for webhook to listen to
  createWebHook: async (req, res) => {
    let authToken = '8e11925c246ecbe407ef9489a39e6b6652a4699b';
    const octokit = new Octokit({
      auth: `${authToken}`
    });
    //const proxyUrl='https://smee.io/ICTKamtcj5qxwrY';
    const proxyUrl = req.body.proxyurl;
    await octokit.repos.createHook({
      owner: req.params.ownerName,
      repo: req.params.repoName,
      config: {
        url: proxyUrl,
        content_type: 'json',
        secret: 'mysecret'
      },
      events: ['*']
    }).then((res) => {
      //  console.log(res);
    }).catch((e) => {
      //console.log(e);
    });

    require('../../services/githubWebHooks/webHookListener.js')(proxyUrl);
    //Start listening for incoming messages on this channel
  },

 //router.get('/api/github/:repoName/branch',gitHub_controller.getAllBranch);
  getAllBranch:async(req,res)=>{
    const octokit = new Octokit();
     const data=await octokit.git.listRefs({
       owner:req.body.owner,
       repo:req.body.repo
     });

     if(data){
      return res.status(200).send(data);
     }
     return res.status(404).send('NOT FOUND');
  },
  createBranch: async (req, res) => {
   //Branch creation information may require TaskId
   //This is such, that we are able to insert this branch adminInformation
   //Into the branch object
    const Env = process.env.NODE_ENV;

    const userId = Env === 'test' ? req.body.authToken : await authenticationManager.getAuthenticatedUserId(req, res);
    if (userId == null) {
      return res.status(403).send('Forbidden');
    }

    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
      await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {

      const authToken = Env === 'test' ? req.headers.user : req.user.token;
      let platNumber = randomIntFromInterval(1000, 9999);
      const branchName = 'refs/heads/feature/PLAT-' + platNumber + '-' + req.body.taskName;
      const octokit = new Octokit({
        auth: `${authToken}`
      });
      const data = await octokit.git.createRef({
        owner: 'JckXia',
        repo: req.params.repoName,
        ref: branchName,
        sha: req.body.oldBranchHashVal
      });

      const addBranchToTaskRes=await taskManager.addGitBranchToTask(req,res);
      if(addBranchToTaskRes.lastErrorObject.updatedExisting == true){
        return res.status(200).send(data);
      }
      return res.status(500).send('Internal server err');
    } else {
      return res.status(403).send('Forbidden');
    }
  },
  deleteBranch: async(req,res)=>{
    const Env = process.env.NODE_ENV;
     const userId=await authenticationManager.getAuthenticatedUserId(req,res);
     if(userId ==null){
       return res.status(403).send('Forbidden');
     }
     if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
       await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {

       const authToken = Env === 'test' ? req.headers.user : req.user.token;
       const octokit=new Octokit({
         auth:`${authToken}`
       });

       let gitRef=req.body.ref;
       if(gitRef.includes('refs/')){
         gitRef=gitRef.replace('refs/','');
       }
       const data=await octokit.git.deleteRef({
         owner:req.body.owner,
         repo:req.body.repo,
         ref: gitRef
       });
       return res.status(200).send(data);
     } else {
       return res.status(403).send('Forbidden');
     }
  },
  //--------------------------------------------------------------//
  getPullRequests: async (req, res) => {
    await authHelper.getAuthenticatedUserId(req, res);
    const repo_owner_name = req.query.repo_owner_name;
    const repo_name = req.query.repo_name;
    const reqUrl = "https://api.github.com/repos/" + repo_owner_name + "/" + repo_name + "/pulls";
    console.log(reqUrl);
    var options = {
      url: reqUrl,
      headers: {
        'User-Agent': 'request'
      }
    }
    request(options, (err, response, body) => {
      if (err) {
        throw err;
      }
      res.send(body);
    });
  },
  createPullRequest:async (req,res)=>{

  },
  deletePullRequest:async (req,res)=>{

  },

  //-------------------------------------------------------//
 //api/task/:repoName/create_task
  createTask:async(req,res)=>{
   //TODO: the steps that we need to take for these calls:
   //1. Create Task item, save the branch reference to the task item
   //2. Make call to API, create associated branches along with it
   // TODO: We will need to reference the data somehow
    const requestBody=req.body;
    if(requestBody.taskTitle ==null || !requestBody.taskDesc==null || req.params.repoName ==null){
    return  res.status(400).send('Missing parameters');
    }
    const result=await repoManager.addTaskToRepo(req,res);

  },
  //api/task/:repoName/delete_task
  deleteTask:async(req,res)=>{
  // We will need to update tasks at two different
  // places
  // 1. We need to remove this task from Task collection
  //2. We will need to remove the task id, from the repo
  const requestBody=req.body;
  const repoName=req.params.repoName;
  await taskManager.removeTask(req,res);
  await repoManager.removeTaskFromRepo(requestBody.taskId,requestBody.repoId);
  res.status(200).send('Successful');
},
  //-------------------------------------------------------//
  getRepoData:async(req,res)=>{
    //When we click on the Link, which takes us to
    //the repoPage, which consists of the details.
    //Data needed:

    const userId=await authenticationManager.getAuthenticatedUserId(req,res);
    if(userId ==null){
      return res.status(403).send('Forbidden');
    }
    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
      await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {
         
      }
  }
}
