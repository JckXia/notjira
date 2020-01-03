const {
  addGitBranchRefToTaskRecord,
  removeGitBranchIdFromTask
} = require("../../manager/task.manager");
const { hasAdminAccess } = require("../../manager/repo.manager");
const {
  getValidBranchNameForDeletion
} = require("../../util/githubUtil/githubUtil");
const Branch = require("../../models/branch.model");
const Repo = require("../../models/repo.model");
const Octokit = require("@octokit/rest");
const { transformBranchObject } = require("./merge");

module.exports = {
  createBranch: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access!");
    }

    const inputVals = args.branchCreationInput;

    const taskId = inputVals.taskId;

    const userId = context.user._id.toString();
    const userName = context.user.username.toString();
    const parentRefHash = inputVals.parentRefHash;
    const parentBranchName = "refs/heads/" + inputVals.parentBranchName;
    const repoName = inputVals.repoName;
    const taskName = inputVals.taskName;
    const branchName = "refs/heads/" + taskName;

    const authToken = context.user.accessToken;
    const octokit = new Octokit({
      auth: `${authToken}`
    });

    try {
      const repoObject = await Repo.findOne({
        repo_name: repoName
      });
      if (repoObject == null) {
        throw new Error(`404 Repo not found!`);
      }
      if (!hasAdminAccess(repoObject, userId)) {
        throw new Error(`403 Unauthenticated user access`);
      }
      const newlyCreatedBranchGitInfo = (await octokit.git.createRef({
        owner: userName,
        repo: repoName,
        ref: branchName,
        sha: parentRefHash
      })).data;

      const newBranchObject = await new Branch({
        headBranchDataInfo: {
          branchName: branchName
        },
        baseBranchDataInfo: {
          sha: parentRefHash,
          branchName: parentBranchName
        }
      }).save();

      try {
        const updateTaskBranchListResp = await addGitBranchRefToTaskRecord(
          taskId,
          newBranchObject._id
        );
        if (!updateTaskBranchListResp.lastErrorObject.updatedExisting) {
          throw new Error(`400 Error branchTaskUpdate is unsuccessful`);
        }
      } catch (err) {
        throw err;
      }
      return transformBranchObject(newBranchObject);
    } catch (err) {
      throw new Error(`Error! ${err.status} ${err.message}`);
    }
  },
  deleteBranch: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access!");
    }
    const repoName = args.repoName;
    const repoOwner = args.repoOwner;
    const branchName = args.branchName;
    const OauthToken = context.user.accessToken;
    const taskId = args.taskId;
    const userId = context.user._id.toString();
    const octokit = new Octokit({
      auth: `${OauthToken}`
    });

    try {
      const repoObject = await Repo.findOne({
        repo_name: repoName
      });
      if (repoObject == null) {
        throw new Error(`404 Repo not found!`);
      }
      if (!hasAdminAccess(repoObject, userId)) {
        throw new Error(`403 Unauthenticated user access`);
      }

      await octokit.git.deleteRef({
        owner: repoOwner,
        repo: repoName,
        ref: getValidBranchNameForDeletion(branchName)
      });

      const deletedBranchObject = await Branch.findOneAndRemove({
        headBranchDataInfo: {
          branchName: branchName
        }
      });
      const deletedBranchId = deletedBranchObject._id;
      await removeGitBranchIdFromTask(deletedBranchId, taskId);
      return transformBranchObject(deletedBranchObject);
    } catch (err) {
      throw new Error(`Error! ${err.status} ${err.message}`);
    }
  }
};
