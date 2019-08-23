const User = require('../models/user.model');

async function validateUserPk(userName, pk) {
  let userRes = await User.findOne({
    username: userName
  });

  userRes = JSON.stringify(userRes);
  userRes = JSON.parse(userRes);

  if (userRes) {
    if (userRes._id == pk) {
      return true;
    }
  } else {
    return false;
  }
}



module.exports = {
  validateUserPk
};
