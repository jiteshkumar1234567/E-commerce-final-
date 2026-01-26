module.exports = function isLoggedIn(req, res, next) {
  // Agar user session me hai
  if (req.session.user) {
    return next(); // allow access
  }

  // Agar owner login system bhi hai
  if (req.session.owner) {
    return next();
  }

  // User/Owner login nahi hai → redirect to login page
  return res.redirect("/users/login");
};