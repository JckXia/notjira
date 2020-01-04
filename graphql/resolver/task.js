const Repo = require("../../models/repo.model");
const {
  hasAdminAccess,
  updateTaskStatusWithinRepo,
  saveTaskRecordToRepo,
  removeTaskFromRepo
} = require("../../manager/repo.manager");
const {
  removeTaskRecord,
  updateTaskStatus,
  taskStateIsValid
} = require("../../manager/task.manager");
const { transformTaskObject } = require("./merge");

module.exports = {
  createTask: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access");
    }
    const newTaskName = args.newTaskName;
    const parentRepoName = args.repoName;
    const taskDescription = args.taskDescription;
    const userId = context.user._id.toString();
    try {
      const repoObject = await Repo.findOne({
        repo_name: parentRepoName
      });
      if (repoObject == null) {
        throw new Error("404 Repo Not found!");
      }

      if (!hasAdminAccess(repoObject, userId)) {
        throw new Error("403! Unauthenticated user access");
      }
      const newTaskObject = await saveTaskRecordToRepo({
        task_state: "",
        task_name: newTaskName,
        task_desc: taskDescription,
        assigned_to: null,
        branch: [],
        pullRequest: [],
        parent_repo: parentRepoName
      });
      console.log(`New Task Object`);
      return transformTaskObject(newTaskObject);
    } catch (err) {
      throw new Error(`Error! ${err.status} ${err.message}`);
    }
  },
  deleteTask: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access");
    }
    const taskId = args.taskId;
    const userId = context.user._id.toString();
    const repoName = args.repoName;
    const repoObject = await Repo.findOne({
      repo_name: repoName
    });
    if (!hasAdminAccess(repoObject, userId)) {
      throw new Error("403! Unauthenticated user access");
    }
    try {
      await removeTaskFromRepo(taskId, repoName);
      const deletedTaskObject = await removeTaskRecord(taskId);
      return transformTaskObject(deletedTaskObject);
    } catch (err) {
      throw new Error(`Error! ${err.status} ${err.message}`);
    }
  },
  //TODO: Since we have switched over to using
  //graphql, the first update should no longer be needed
  updateTaskStatus: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access");
    }
    const repoName = args.repoName;
    const taskId = args.taskId;
    const taskState = args.taskState;
    if (!taskStateIsValid(taskState)) {
      throw new Error(`Error! 422 . ${taskState} is not a valid state`);
    }
    try {
      const taskUpdateResponse = await updateTaskStatusWithinRepo(
        taskId,
        repoName,
        taskState
      );
      const taskUpdateResponseObject = await updateTaskStatus(
        taskId,
        taskState
      );
      return transformTaskObject(taskUpdateResponseObject);
    } catch (err) {
      throw err;
    }
  }
};
