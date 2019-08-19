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

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

async function addRepoToUserProfile(repoId,repoName,userName,webHookUrl,repo_html_url,repo_creator) {
  const date_created=getDate();
  const repoObject={id:repoId,name:repoName,webhookurl:webHookUrl,repo_html_url:repo_html_url,date_created:date_created,repo_creator:repo_creator};
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
