const { transformUserObject } = require("./merge");

module.exports = {
  userInfo: async (args, context) => {
    const userObject = context.user;
    const requestObject = context.requestBody;
    console.log(requestObject.isAuthenticated());
    if (requestObject.isAuthenticated()) {
      return transformUserObject(userObject);
    } else {
      throw new Error("403! Unauthenticated!");
    }
  }
};
