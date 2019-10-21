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
const request=require('superagent');
module.exports = {

  //Create a repository
  createRepo: async (req, res) => {

    const Env = process.env.NODE_ENV;

    const userId = Env == 'test' ? req.headers.id : await authenticationManager.getAuthenticatedUserId(req, res);
    const proxyUrl = req.body.proxyUrl;
    if (userId == null) {
      return res.status(403).send('Forbidden! User not authenticated');
    }
    const authToken = Env == 'test' ? req.headers.user : req.user.accessToken;

    const octokit = new Octokit({
      auth: `${authToken}`
    });
    const repoName = req.body.repoName;
    try {
      const repoCreationResp = await octokit.repos.createForAuthenticatedUser({
        name: repoName
      });


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

      const authToken = Env == 'test' ? req.headers.user : req.user.accessToken;
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
     const requestBody=req.body;
     if(!requestBody.taskId || !requestBody.parentRefHash ||!req.params.repoName || !requestBody.userInfo.userName){
       return res.status(400).send('Cant complete this request based on information given');
     }
    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
      await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {

      const authToken = Env === 'test' ? req.headers.user : req.user.accessToken;
      const branchName = 'refs/heads/'+req.body.taskName;
      const taskId=req.body.taskId;

      const octokit = new Octokit({
        auth: `${authToken}`
      });
      const createRefResp = await octokit.git.createRef({
        owner: requestBody.userInfo.userName,
        repo: req.params.repoName,
        ref: branchName,
        sha: req.body.parentRefHash
      });
      const refInfo=createRefResp.data;
      let parentBranchName=req.body.parentBranchName;
       parentBranchName='refs/heads/'+parentBranchName;
      const addBranchToTaskRes=await taskManager.addGitBranchToTask({refName:refInfo.ref,gitInfo:refInfo.object},req.body.parentRefHash,parentBranchName,taskId);
      if(addBranchToTaskRes.lastErrorObject.updatedExisting == true){
        return res.status(200).send(addBranchToTaskRes);
      }
      return res.status(500).send('Internal server error');
    }else{
      return res.status(403).send('FORBIDDEN');
    }
  },
  deleteBranch: async(req,res)=>{
    const Env = process.env.NODE_ENV;
     const userId=await authenticationManager.getAuthenticatedUserId(req,res);
     if(userId ==null){
       return res.status(403).send('Forbidden');
     }
     if (await repoManager.userIsAdminOfRepo(userId, req.body.repo) ||
       await repoManager.userIsCollaboratorOfRepo(userId, req.body.repo)) {

       const authToken = Env === 'test' ? req.headers.user : req.user.accessToken;
       const octokit=new Octokit({
         auth:`${authToken}`
       });

       let gitRef=req.body.ref;
       if(gitRef.includes('refs/')){
         gitRef=gitRef.replace('refs/','');
       }
       if(!gitRef.includes('heads/')){
         gitRef='heads/'+gitRef;
       }
      try{
       const data=await octokit.git.deleteRef({
         owner:req.body.owner,
         repo:req.body.repo,
         ref: gitRef
       });
       gitRef='refs/'+gitRef;
       const taskId=req.body.taskId;

       try{
      const removeBranchFromTaskRes=await taskManager.removeGitBranchFromTask(gitRef,taskId);

        if(removeBranchFromTaskRes.lastErrorObject.updatedExisting == true){
          return res.status(200).send(removeBranchFromTaskRes);
        }
      }catch(e){
       return res.status(500).send(e);
     }
     }catch(e){
       return res.status(500).send(e);
     }

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
     console.log('CREATING PULL REQUEST');

     const authToken=req.user.accessToken;

       const octokit=new Octokit({
         auth:`${authToken}`
       });

    const owner=req.body.owner;
    const repo=req.body.repo;
    const title='RANDOM PR';
    let head=req.body.head;
    const base=req.body.base;


   octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base
  }).then((res)=>{

  }).catch((e)=>{
      console.log(e.errors[0].message);
      return res.send({status:e.status,message:e.errors[0].message});
  })

      // let headBranch= req.body.ref;
      // if(headBranch.includes('refs/')){
      //   headBranch=headBranch.replace('refs/','');
      // }
      // if(!headBranch.includes('heads/')){
      //     headBranch='heads/'+headBranch;
      // }
      // let baseBranch=req.body.parentRef;

    //   try{
    // '//   const createPrRes=await octokit.pulls.create({
    //
    //    });
    //   }catch(e){
    //     console.log(e);
    //   }
  //  return res.status(200).send('OKAY');
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

    if(requestBody.taskName ==null || req.params.repoName ==null){
    return  res.status(400).send('Missing parameters');
    }
    const userId= await authenticationManager.getAuthenticatedUserId(req, res);
    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
      await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {

    const result=await repoManager.addTaskToRepo(req,res);
    return res.status(200).send(result);
  }else{
    return res.status(403).send('User unable to create new tasks');
  }
},
  //api/github/:repoName/delete_task
  //Params:
  // taskId: req.body.taskId
  // repoName: req.parms.repoName
  deleteTask:async(req,res)=>{

  const requestBody=req.body;
  const repoName=req.params.repoName;
 repoManager.removeTaskFromRepo(requestBody.taskId,repoName).then(()=>{
   taskManager.removeTask(req,res).then(()=>{

        return res.status(200).send('Successful');
   });
 })

},
updateTaskStatus:async (req,res)=>{
// TODO: Add a check prior to perform this action
  const requestBody=req.body;
  const repoName=req.params.repoName;
  const taskUpdateResp=await repoManager.updateTaskStatusWithinRepo(requestBody.taskId,repoName,requestBody.taskState);
  const updateTaskCollection=await taskManager.updateTaskStatus(requestBody.taskId,requestBody.taskState);
  return res.status(200).send(taskUpdateResp);
},
//api/github/:repoName/getTasks
getAllTasks:async(req,res)=>{
  const userId=await authenticationManager.getAuthenticatedUserId(req,res);
  if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
    await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {
        if(req.params.repoName == null){
          return res.status(400).send('Incorrect parameters!');
        }
      const repo=await repoManager.getRepoByName(req.params.repoName);

      return res.status(200).send(repo.taskItems);
    }else{
      return res.status(403).send('Forbidden!');
    }
},
changeTaskStatus:async(req,res)=>{
  //
  //POST call
  //status: req.body.status
  //taskId:
  const taskId=req.body.taskId;
  const taskStatus=req.body.taskStatus;
  const taskData=await taskManager.findTaskById(taskId);
  const repoName=taskData.repoName;

  return res.status(200).send('Okay');
},
getOneTask:async(req,res)=>{
  //This is how we will proceed:
  //1. Get task item according to ID
  //2. Get repo Field from said Task
  //3. Check to see that user is the admin of the repo
  //4. return data
 const userId=await authenticationManager.getAuthenticatedUserId(req,res);
  const taskId=req.query.taskId;
  const taskData=await taskManager.findTaskById(taskId);
  const repoName=taskData.repoName;
  if(await repoManager.userIsAdminOfRepo(userId,repoName)){
     return res.status(200).send(taskData);
  }
  return res.status(403).send('Forbidden access');
},
  //-------------------------------------------------------//
//api/repo/:repoName
  getRepoData:async(req,res)=>{
    //When we click on the Link, which takes us to
    //the repoPage, which consists of the details.
  //  console.log('ROUTE REACHED');
    const repoData=await repoManager.getRepoByName(req.params.repoName);
        //const PId=await authenticationManager.getAuthenticatedUserId(req,res);
    //console.log(repoData);
    //console.log(PId);
    //return res.status(200).send(repoData);

    const userId=await authenticationManager.getAuthenticatedUserId(req,res);
    if(userId ==null){
      return res.status(403).send('Forbidden');
    }
    if (await repoManager.userIsAdminOfRepo(userId, req.params.repoName) ||
      await repoManager.userIsCollaboratorOfRepo(userId, req.params.repoName)) {
         const repoData=await repoManager.getRepoByName(req.params.repoName);

         return res.status(200).send(repoData);
      }
  },
  getRepoRef:async(req,res)=>{


    const userName=req.params.userName;
    const repoName=req.params.repoName;

    if(req.user.username == req.params.userName){
      const authToken=req.user.accessToken;
      const octokit = new Octokit({
        auth: `${authToken}`
      });

     const dataTest=await octokit.repos.listBranches({
       owner:userName,
       repo:repoName
     });
      if(dataTest.data == null){
        return res.status(404).send([]);
      }
  //   console.log('CHECK_DATA ',dataTest.data[0].commit);
      return res.status(200).send(dataTest.data);
    }else{
      return res.status(403).send('Forbidden');
    }

  }
}
