const User=require('../models/user.model.js');

module.exports={
  //Testing getting all users from the database
   testGetAllUsers:function(req,res){
     User.find({},(err,users)=>{
       if(err){
         throw err;
       }
       res.send(users);
     })
   },
   //Testing get a user by their id
   getUserById:function(req,res){
     let id=req.params.id;
     User.findOne({_id:id},(err,user)=>{
       if(err){
         throw err;
       }
       res.send(user);
     })
   },

   //Testing etting a user by their username
   getUserName:function(req,res){
    let userName=req.query.username;
    User.find({username:userName},(err,users)=>{
      if(err){
        throw err;
      }
      res.send(users);
    })
   },
   addProjectToUserProfile:(req,res)=>{
     let projectId=req.query.project_id;
     let userid=req.params.id;

     User.updateOne({_id:userid},{$push:{project_lists:projectId}},function(err,model){
       if(err){
         throw err;
       }
       res.send(model);
     })
   },
   removeProjectFromUserProfile:(req,res)=>{
     let projectId=req.query.project_id;
     let userid=req.params.id;

     User.updateOne({_id:userid},{$pull:{project_lists:projectId}},function(err,model){
       if(err){
         throw err;
       }
       res.send(model);
     })
   }

};
