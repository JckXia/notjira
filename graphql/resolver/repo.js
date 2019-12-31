const Repo = require("../../models/repo.model");
const Octokit = require("@octokit/rest");
const { transformRepoObject } = require("./merge");
const {
  addRepoToUserProfile,
  removeRepoFromUserProfile
} = require("../../manager/user.manager");
const {
  saveNewRepoToDataBase,
  deleteRepoRecord
} = require("../../manager/repo.manager");
const { hasAdminAccess } = require("../../manager/repo.manager");
module.exports = {
  singleRepo: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403! Unauthenticated user access");
    }

    const userId = context.user._id.toString();
    const repoId = args.repoId;
    const repoObject = await Repo.findById(repoId);
    if (!hasAdminAccess(repoObject, userId)) {
      throw new Error("403 Unauthenticated user acess!");
    }

    return transformRepoObject(repoObject);
  },
  createRepo: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403! Unauthenticated user access");
    }
    const userId = context.user._id.toString();
    const userName = context.user.username.toString();
    const newRepoName = args.repoName;
    const OauthToken = context.user.accessToken;
    const octokit = new Octokit({
      auth: `${OauthToken}`
    });
    try {
      const repoCreationResponseObject = await octokit.repos.createForAuthenticatedUser(
        {
          name: newRepoName
        }
      );
      const newRepoObject = await saveNewRepoToDataBase(
        newRepoName,
        userName,
        userId,
        [],
        [],
        "",
        repoCreationResponseObject.data.html_url
      );
      try {
        //TODO Remove the other fields to observe if it still does as expected
        await addRepoToUserProfile(
          newRepoObject.id,
          newRepoObject.repo_name,
          userName,
          "",
          repoCreationResponseObject.data.html_url,
          userName
        );
      } catch (error) {
        throw error;
      }

      return transformRepoObject(newRepoObject);
    } catch (error) {
      throw new Error(`Error! ${error.status} ${error.message}`);
    }
  },
  deleteRepo: async (args, context) => {
    if (!context.requestBody.isAuthenticated()) {
      throw new Error("403 Unauthenticated user access!");
    }

    const userName = context.user.username.toString();
    const repoName = args.repoName;
    const OauthToken = context.user.accessToken;
    const octokit = new Octokit({
      auth: `${OauthToken}`
    });

    try {
      await octokit.repos.delete({
        owner: userName,
        repo: repoName
      });
      const deletedRepoObject = await deleteRepoRecord(repoName);

      await removeRepoFromUserProfile(
        deletedRepoObject._doc._id.toString(),
        repoName,
        userName
      );
      return {
        status: 200,
        message: "Successfully deleted Repository!"
      };
    } catch (error) {
      throw error;
    }
  }
};
