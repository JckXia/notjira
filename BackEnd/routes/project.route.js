const express=require('express');
const router=express.Router();
const project_controller=require('../controllers/project.controller.js');

router.get('/test',project_controller.test);

module.exports=router;
