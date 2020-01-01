const { addGitBranchToTask } = require("../../manager/task.manager");
const { hasAdminAccess } = require("../../manager/repo.manager");
const Branch = require("../../models/branch.model");
const Repo = require("../../models/repo.model");
const Octokit = require("@octokit/rest");

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
      const addBranchToTaskRes = await addGitBranchToTask(
        {
          refName: newlyCreatedBranchGitInfo.ref,
          gitInfo: newlyCreatedBranchGitInfo.object
        },
        parentRefHash,
        parentBranchName,
        taskId
      );
      return {
        branchName: branchName,
        refName: newlyCreatedBranchGitInfo.ref,
        parentRefData: parentRefHash,
        parentBranchName: parentBranchName
      };
    } catch (err) {
      throw new Error(`Error! ${err.status} ${err.message}`);
    }
  }
};
