const Repo = require("../../models/repo.model");
const { transformRepoObject } = require("./merge");

module.exports = {
  singleRepo: async (args, context) => {
    const repoId = args.repoId;
    const repoObject = await Repo.findById(repoId);

    return transformRepoObject(repoObject);
  }
};
