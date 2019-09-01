const express=require('express');
const router=express.Router();
const gitHub_controller=require('../controllers/github.controller.js');

//We will post to the github APIs, create the branch/data on github's side
//Once data is created and returned back, we will store it accordingly
//in our database.This way we wont have to do any creation action on our side
router.get('/api/github/repo/:repoName',gitHub_controller.getRepoData);
router.post('/api/github/:repoName/task/create_branch',gitHub_controller.createBranch);
router.get('/api/github/:repoName/branch',gitHub_controller.getAllBranch);
router.post('/api/github/delete_branch',gitHub_controller.deleteBranch);

router.post('/api/task/:repoName/create_task',gitHub_controller.createTask);
router.post('/api/task/:repoName/delete_task',gitHub_controller.deleteTask);
router.post('/api/github/repo/create',gitHub_controller.createRepo);
router.post('/api/github/repo/:repoName/delete',gitHub_controller.deleteRepo);
router.post('/api/getPullRequests',gitHub_controller.getPullRequests);

router.post('/api/github/:ownerName/:repoName/webhook/create',gitHub_controller.createWebHook);



/*
 Below are API end points that we can use to work with References
*/

module.exports=router;
