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

module.exports = {
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
