module.exports = {
  getValidBranchName: branchName => {
    if (branchName.includes("refs/heads/")) {
      return branchName;
    }
    branchName = "refs/heads/" + branchName;
    return branchName;
  }
};
