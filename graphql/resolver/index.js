const testResolver = require("./test");
const userResolver = require("./user");
const repoResolver = require("./repo");
const rootResolver = {
  ...repoResolver,
  ...testResolver,
  ...userResolver
};

module.exports = rootResolver;
