module.exports = {
  testGet: (args, context) => {
    // console.log(context.user);
    console.log(`INFO DISPLAY TOKEN ${context.user.accessToken}`);
    return "TestGetSuccessfull";
  }
};
