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

async function addRepoToUserProfile(repoId,repoName,userName) {
  const repoObject={id:repoId,name:repoName};
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
module.exports = {
  getUserById,
  getUserByUserName,
  addRepoToUserProfile,
  removeRepoFromUserProfile
};
