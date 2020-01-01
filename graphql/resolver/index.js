const testResolver = require("./test");
const userResolver = require("./user");
const repoResolver = require("./repo");
const taskResolver = require("./task");
const branchResolver = require("./branch");
const rootResolver = {
  ...branchResolver,
  ...repoResolver,
  ...testResolver,
  ...userResolver,
  ...taskResolver
};

module.exports = rootResolver;
