const Task = require("../../models/task.model");
const Repo = require("../../models/repo.model");
const getTaskObjects = async taskItemsData => {
  const taskItemIds = taskItemsData.map(taskItem => {
    return taskItem._id;
  });
  try {
    const taskItemObjects = await Task.find({ _id: { $in: taskItemIds } });
    return taskItemObjects.map(taskItemObject => {
      return {
        ...taskItemObject._doc,
        pullRequestList: taskItemObject._doc.pullRequest
      };
    });
  } catch (err) {
    throw err;
  }
};

const getRepoObjects = async repoData => {
  const repoIds = repoData.map(repoObject => {
    return repoObject.id;
  });
  try {
    const repoObjects = await Repo.find({ _id: { $in: repoIds } });
    return repoObjects.map(repoObject => {
      return module.exports.transformRepoObject(repoObject);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  transformUserObject: async userObject => {
    return {
      ...userObject,
      userName: userObject.username,
      gitHubId: userObject.gitHubId,
      repoLists: getRepoObjects.bind(this, userObject.repo_lists)
    };
  },
  transformRepoObject: async repoObject => {
    return {
      ...repoObject._doc,
      task_items: getTaskObjects.bind(this, repoObject.taskItems)
    };
  },
  transformRepoObjects: async repoObjects => {
    return repoObjects.map(repoObject => {
      return this.transformRepoObject(repoObject);
    });
  }
};
