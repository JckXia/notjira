const Repo = require("../../models/repo.model");

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

const getRepoObject = async repoData => {
  return {
    ...repoData._doc,
    task_items: getTaskObjects.bind(this, [repoData.taskItems])
  };
};

module.exports = {
  singleRepo: async (args, context) => {
    const repoId = args.repoId;
    const repoObject = await Repo.findById(repoId);
    return {
      ...repoObject._doc,
      task_items: getRepoObject(this, Repo.taskItems)
    };
  }
};
