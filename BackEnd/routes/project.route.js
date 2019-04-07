const express=require('express');
const router=express.Router();
const project_controller=require('../controllers/project.controller.js');
const authenticationHelper=require('../util/authenticationHelper');

router.get('/test',authenticationHelper.isAuthenticated,project_controller.test);

module.exports=router;
