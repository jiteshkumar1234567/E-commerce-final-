const express = require("express");
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  userProfile, 
  userUpdateProfile, 
  userMyOrder 
} = require("../Controller/authController");

const isLoggedIn = require("../Middleware/isLoggedIn");

// ----------------- REGISTER -----------------
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", registerUser);

// ----------------- LOGIN -----------------
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", loginUser);

// ----------------- LOGOUT -----------------
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

// ----------------- PROFILE -----------------
router.get("/profile", isLoggedIn, userProfile);

// ----------------- UPDATE PROFILE ----------
router.post("/profile/update", isLoggedIn, userUpdateProfile);

// ----------------- MY ORDERS ----------------
router.get("/my-orders", isLoggedIn, userMyOrder);

module.exports = router;
