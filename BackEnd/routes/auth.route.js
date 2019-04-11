const express=require('express');
const router=express.Router();
const passport=require('passport');
const login_controller=require('../controllers/localLogin.controller.js');
const jwt=require('jsonwebtoken');
//Github authentication routes ----------------------------------------------- //
router.get('/auth/github',passport.authenticate('github'),function(req,res){});

router.get('/auth/github/callback',passport.authenticate('github'),(req,res)=>{
  res.redirect('/');
});

router.get('/auth/github/logout',(req,res)=>{

  req.logout();
  res.redirect('/');
});

// ----------------------------------------------------------------------------- //


//Local authentication routes -------------------------------------------------- //
router.post('/auth/local/register',login_controller.register);
router.post('/auth/local/login',login_controller.login);
 
// -------------------------------------------------------------------------------//

router.get('/testAuth',login_controller.getUserInfoAuth);



router.get('/',(req,res)=>{
  res.send(req.user);
});

router.get('/logout',(req,res)=>{

  req.logout();
  res.redirect('/');
});

module.exports=router;
