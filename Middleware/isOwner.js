module.exports = function isOwner(req, res, next) {
  if (req.session.owner) {  
    next();
  } else {
    res.redirect("/users/login"); // redirect if not owner
  }
}