const express=require('express');
const router=express.Router();
const task_controller=require('../controllers/task.controller.js');

//We will post to the github APIs, create the branch/data on github's side
//Once data is created and returned back, we will store it accordingly
//in our database.This way we wont have to do any creation action on our side
router.post('/task/create_task',task_controller.createTask);
router.get('/api/task/:taskId',task_controller.getTask);
router.get('/api/task/:repoName',task_controller.getAllTasks);
router.post('/api/task/delete_task',task_controller.deleteTask);

/*
 Below are API end points that we can use to work with References
*/

module.exports=router;
