const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const branchSchema = new Schema({
  headBranchDataInfo: { sha: String, branchName: String, url: String },
  baseBranchDataInfo: {
    sha: String,
    branchName: String,
    url: String,
    type: String
  }
});
module.exports = mongoose.model("branch", branchSchema);
