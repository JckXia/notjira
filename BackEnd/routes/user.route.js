const express=require('express');
const router=express.Router();
const user_controller=require('../controllers/user.controller.js');

router.get('/',user_controller.testGetAllUsers);

router.get('/username',user_controller.getUserName);

router.get('/:id',user_controller.getUserById);

router.post('/add/project/:id',user_controller.addProjectToUserProfile);

router.post('/delete/project/:id',user_controller.removeProjectFromUserProfile);

module.exports=router;
