const Repo = require("../../models/repo.model");
const { transformRepoObject } = require("./merge");
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
  }
};
