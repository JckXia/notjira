const express=require('express');
const router=express.Router();
const gitHub_controller=require('../controllers/github.controller.js');

router.post('/createBranch',gitHub_controller.createBranch);

router.post('/getPullRequests',gitHub_controller.getPullRequests);

module.exports=router;
