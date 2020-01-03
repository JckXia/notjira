const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const branchSchema = new Schema({
  headBranchDataInfo: { sha: String, branchName: String, url: String },
  baseBranchDataInfo: { type: Object, required: true }
});
module.exports = mongoose.model("branch", branchSchema);
