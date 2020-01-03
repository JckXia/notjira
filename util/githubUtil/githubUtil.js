module.exports = {
  getValidBranchName: branchName => {
    if (branchName.includes("refs/heads/")) {
      return branchName;
    }
    branchName = "refs/heads/" + branchName;
    return branchName;
  },
  getValidBranchNameForDeletion: branchName => {
    if (!branchName.includes("refs/")) {
      return branchName;
    }
    branchName = branchName.replace("refs/", "");
    return branchName;
  }
};
