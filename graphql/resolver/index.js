const testResolver = require("./test");
const userResolver = require("./user");
const rootResolver = {
  ...testResolver,
  ...userResolver
};

module.exports = rootResolver;
