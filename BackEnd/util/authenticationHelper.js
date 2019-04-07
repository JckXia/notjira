function isAuthenticated(req, res, next) {
  let token = req.headers['x-access-token'];
  if (req.isAuthenticated() || token) {
    return next();
  }
  res.redirect('/login');
}
module.exports = {
  isAuthenticated: isAuthenticated
};
