const Repo = require("../../models/repo.model");
const Task = require("../../models/task.model");

const getTaskObjects = async taskItemsData => {
  const taskItemIds = taskItemsData.map(taskItem => {
    return taskItem._id;
  });
  try {
    const taskItemObjects = await Task.find({ _id: { $in: taskItemIds } });
    return taskItemObjects.map(taskItemObject => {
      return {
        ...taskItemObject._doc
      };
    });
  } catch (err) {
    throw err;
  }
};

const getRepoObjects = async repoData => {
  console.log("Exected!");
  const repoIds = repoData.map(repoObject => {
    return repoObject.id;
  });
  try {
    const repoObjects = await Repo.find({ _id: { $in: repoIds } });
    return repoObjects.map(repoObject => {
      return {
        ...repoObject._doc,
        task_items: getTaskObjects.bind(this, repoObject.taskItems)
      };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  userInfo: async (args, context) => {
    const userObject = context.user;
    const requestObject = context.requestBody;
    console.log(requestObject.isAuthenticated());
    if (requestObject.isAuthenticated()) {
      // getRepoObjects(userObject.repo_lists);

      //TODO: Perform another request to get repoLists
      return {
        ...userObject,
        userName: userObject.username,
        gitHubId: userObject.gitHubId,
        repoLists: getRepoObjects.bind(this, userObject.repo_lists)
      };
    } else {
      throw new Error("403! Unauthenticated!");
    }
  }
};
