const User = require('../models/user.model');

async function getUserById(userId) {
  const user = await User.findOne({
    _id: userId
  });
  return user;
}

async function getUserByUserName(userName) {
  const user = await User.findOne({
    username: userName
  });
  return user;
}

async function addRepoToUserProfile(repoId,repoName,userName,webHookUrl) {
  const repoObject={id:repoId,name:repoName,webhookurl:webHookUrl};
  const addRepoToUser = await User.findOneAndUpdate({
    username: userName
  }, {
    $push: {
      repo_lists: repoObject
    }
  });
  const user=await getUserByUserName(userName);
  return user;
}

async function removeRepoFromUserProfile(repoId,repoName,userName){
   const deletedRepoObject={id:repoId,name:repoName};
   await User.findOneAndUpdate({
     username:userName
   },{
     $pull:{
       repo_lists:deletedRepoObject
     }
   });
   const user=await getUserByUserName(userName);
   return user;
}

async function returnAllReposFromUserProfile(userName){
  const user= await getUserByUserName(userName);
  return user.repo_lists;
}

module.exports = {
  getUserById,
  getUserByUserName,
  addRepoToUserProfile,
  removeRepoFromUserProfile,
  returnAllReposFromUserProfile
};
