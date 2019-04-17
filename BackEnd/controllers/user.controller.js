const User=require('../models/user.model.js');
const authHelper=require('../util/authenticationHelper');

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
   //Authenticated user
   getUserById:async function(req,res){
     const userId=await authHelper.getAuthenticatedUserId(req,res);
     if(userId == null){
       return res.status(403).send('Forbidden');
     }
     let id=req.params.id;
     const user=await User.findOne({_id:id});
     if(user){
       return res.status(200).send(user);
     }
    return res.status(404).send('User Not found');
   },

   //Testing etting a user by their username
   getUserName:async function(req,res){
     const userId=await authHelper.getAuthenticatedUserId(req,res);
     if(userId==null){
       return res.status(403).send('Forbidden');
     }
    let userName=req.query.username;
    User.find({username:userName},(err,users)=>{
      if(err){
        throw err;
      }
      return res.status(200).send(users);
    });
   },
   addProjectToUserProfile:async (req,res)=>{
     const userId=await authHelper.getAuthenticatedUserId(req,res);
     if(userId == null){
       return res.status(403).send('Forbidden');
     }
     let projectId=req.query.project_id;
     let userid=req.params.id;

     User.updateOne({_id:userid},{$push:{project_lists:projectId}},function(err,model){
       if(err){
         throw err;
       }
       return res.send(model);
     })
   },
   removeProjectFromUserProfile:async (req,res)=>{
     const userId=await authHelper.getAuthenticatedUserId(req,res);
     if(userId == null){
       return res.status(403).send('Forbidden');
     }
     let projectId=req.query.project_id;
     let userid=req.params.id;

     User.updateOne({_id:userid},{$pull:{project_lists:projectId}},function(err,model){
       if(err){
         throw err;
       }
      return res.send(model);
     })
   }

};
