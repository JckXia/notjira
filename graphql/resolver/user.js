const Repo = require("../../models/repo.model");

const getRepoObjects = async repoData => {
  console.log("Exected!");
  const repoIds = repoData.map(repoObject => {
    return repoObject.id;
  });
  try {
    const repoObjects = await Repo.find({ _id: { $in: repoIds } });
    return repoObjects.map(repoObject => {
      return {
        ...repoObject._doc
      };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  userInfo: async (args, context) => {
    const userObject = context.user;
    // getRepoObjects(userObject.repo_lists);

    //TODO: Perform another request to get repoLists
    return {
      ...userObject,
      userName: userObject.username,
      gitHubId: userObject.gitHubId,
      repoLists: getRepoObjects.bind(this, userObject.repo_lists)
    };
  }
};
