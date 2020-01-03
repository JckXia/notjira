const Octokit = require("@octokit/rest");
const { getValidBranchName } = require("../../util/githubUtil/githubUtil");
const { addPullRequestToTask } = require("../../manager/task.manager");
module.exports = {
  createPullRequest: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access");
    }
    const inputParameter = args.pullRequestCreationInput;
    const repoOwner = inputParameter.repoOwner;
    const repoName = inputParameter.repoName;
    const title = inputParameter.title || "PR_FOR_ONE";
    const headBranchName = inputParameter.headBranchName;
    const baseBranchName = inputParameter.baseBranchName;
    const taskId = inputParameter.taskId;
    const OauthToken = context.user.accessToken;
    const octokit = new Octokit({
      auth: `${OauthToken}`
    });

    try {
      const pullRequestCreationResponse = await octokit.pulls.create({
        owner: repoOwner,
        repo: repoName,
        title: title,
        head: getValidBranchName(headBranchName),
        base: getValidBranchName(baseBranchName)
      });

      if (pullRequestCreationResponse.status == 201) {
        const pullRequestUrlLink = pullRequestCreationResponse.data.url;
        const addPullRequestToTaskRes = await addPullRequestToTask(
          title,
          pullRequestUrlLink,
          taskId
        );
        return {
          pullRequestTitle: title,
          pullRequestUrl: pullRequestUrlLink
        };
      }
    } catch (err) {
      throw new Error(`Error! ${err.status} ${err.message}`);
    }
  }
};
