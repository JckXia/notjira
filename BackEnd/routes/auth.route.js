const express=require('express');
const router=express.Router();
const passport=require('passport');

router.get('/auth/github',passport.authenticate('github'),function(req,res){

});

router.get('/auth/github/callback',passport.authenticate('github'),(req,res)=>{
  res.redirect('/');
});

router.get('/',(req,res)=>{
  res.send(req.user);
});

router.get('/logout',(req,res)=>{

  req.logout();
  res.redirect('/');
});

module.exports=router;
