const testResolver = require("./test");
const userResolver = require("./user");
const repoResolver = require("./repo");
const taskResolver = require("./task");
const branchResolver = require("./branch");
const pullRequestResolver = require("./pullRequest");
const rootResolver = {
  ...pullRequestResolver,
  ...branchResolver,
  ...repoResolver,
  ...testResolver,
  ...userResolver,
  ...taskResolver
};

module.exports = rootResolver;
