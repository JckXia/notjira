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

  if (decoded) {
    return decoded.id;
  }

  return {
    error: 'Unable to verify token'
  };

}

async function getAuthenticatedUserId(req, res) {

  if (!isAuthenticated(req, null)) {
    return null;
  }

  const authType = authenticationMethod(req);

  switch (authType) {
    case authTypes.GITHUB_SSO:
      return req.user.id;
      break;
    case authTypes.LOCAL_AUTH:
      const user_id = await getLocalAuthUserId(req);
      if (user_id == null) {
        return null;
      }
      return user_id;
      break;
  }

}
module.exports = {
  isAuthenticated: isAuthenticated,
  authenticationMethod: authenticationMethod,
  getLocalAuthUserId: getLocalAuthUserId,
  getAuthenticatedUserId: getAuthenticatedUserId
};
