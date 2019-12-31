const Task = require("../../models/task.model");
const Repo = require("../../models/repo.model");

//TODO Refactor the database logic surrounding
//storing branch objects
const getBranchObjects = async branchDataObjects => {
  return branchDataObjects.map(branchDataObject => {
    console.log(branchDataObject.branchRefData);
    return {
      ...branchDataObject,
      branchRefData: {
        sha: branchDataObject.branchRefData.gitInfo.sha,
        type: branchDataObject.branchRefData.gitInfo.type,
        url: branchDataObject.branchRefData.gitInfo.url
      }
    };
  });
};

const getTaskObjects = async taskItemsData => {
  const taskItemIds = taskItemsData.map(taskItem => {
    return taskItem._id;
  });
  try {
    const taskItemObjects = await Task.find({ _id: { $in: taskItemIds } });
    return taskItemObjects.map(taskItemObject => {
      return {
        ...taskItemObject._doc,
        branchList: getBranchObjects.bind(this, taskItemObject._doc.branch),
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
