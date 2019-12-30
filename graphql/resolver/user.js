const User = require("../../models/user.model");
module.exports = {
  userInfo: async (args, context) => {
    const userObject = context.user;
    //TODO: Perform another request to get repoLists
    return {
      ...userObject,
      userName: userObject.username,
      repoLists: userObject.repo_lists
    };
  }
};
