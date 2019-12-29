module.exports = {
  testGet: (args, context) => {
    console.log(context.user);
    return "TestGetSuccessfull";
  }
};
