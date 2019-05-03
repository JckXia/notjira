const express=require('express');
const router=express.Router();
const passport=require('passport');
const login_controller=require('../controllers/localLogin.controller.js');
const jwt=require('jsonwebtoken');
//Github authentication routes ----------------------------------------------- //
router.get('/auth/github/login',passport.authenticate('github',{scope:['repo','delete_repo']}));

router.get('/auth/github/callback',passport.authenticate('github'),(req,res)=>{
  res.redirect('/');
});

router.get('/auth/github/checkForUserToken',(req,res)=>{

   console.log(req.isAuthenticated());
   console.log(req.user);
   res.send(req.user);
});

router.get('/auth/github/getUser',(req,res)=>{
  let data=req.user.text;
  console.log(data);
//  data=JSON.parse(data);
  res.send(data);
});

router.post('/auth/github/checkUserStatus',(req,res)=>{
   console.log(req.user);
   const userIsLoggedIn=req.isAuthenticated();
   res.send(userIsLoggedIn);
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
