const authTypes = require('../util/constants/authenticationType');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

function isAuthenticated(req, res) {
  let token = req.headers['x-access-token'];
  if (req.isAuthenticated() || token) {
    return true;
  }
  return false;
}

function authenticationMethod(req) {
  let token = req.headers['x-access-token'];

  if (req.user) {
    return authTypes.GITHUB_SSO;
  }
  if (token) {
    return authTypes.LOCAL_AUTH;
  }
}
async function getLocalAuthUserId(req) {
  let token = req.headers['x-access-token'];
  const decoded = await jwt.verify(token, 'secret');
  return decoded.id;
}
module.exports = {
  isAuthenticated: isAuthenticated,
  authenticationMethod: authenticationMethod,
  getLocalAuthUserId: getLocalAuthUserId
};
