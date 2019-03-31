const express=require('express');
const router=express.Router();
const user_controller=require('../controllers/user.controller.js');

router.get('/test',user_controller.test);

module.exports=router;
