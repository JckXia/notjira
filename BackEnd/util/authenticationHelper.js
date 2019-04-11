const authTypes =require('../util/constants/authenticationType');
function isAuthenticated(req, res) {
  let token = req.headers['x-access-token'];
  if (req.isAuthenticated() || token) {
    return ;
  }
  res.redirect('/login');
}
function authenticationMethod(req){
    let token=req.headers['x-access-token'];

  if(req.user){
    return authTypes.GITHUB_SSO;
  }
  if(token){
    return authTypes.LOCAL_AUTH;
  }
}
module.exports = {
  isAuthenticated: isAuthenticated,
  authenticationMethod:authenticationMethod
};
