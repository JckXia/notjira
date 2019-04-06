const express=require('express');
const router=express.Router();
const passport=require('passport');
const login_controller=require('../controllers/localLogin.controller.js');

router.get('/auth/github',passport.authenticate('github'),function(req,res){

});

router.get('/auth/github/callback',passport.authenticate('github'),(req,res)=>{
  res.redirect('/');
});


router.post('/auth/local/register',login_controller.register);

router.post('/auth/local/login',login_controller.login);


router.get('/',(req,res)=>{
  res.send(req.user);
});

router.get('/logout',(req,res)=>{

  req.logout();
  res.redirect('/');
});

module.exports=router;
