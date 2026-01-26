const express = require("express");
const router = express.Router();
const { registerUser, loginUser, userProfile, userUpdateProfile, userMyOrder,resendVerification, verifyEmail } = require("../Controller/authController");
const isLoggedIn = require("../Middleware/isLoggedIn");
const User = require("../Models/user-model"); 


// ----------------- REGISTER -----------------
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", registerUser);

// ----------------- LOGIN -----------------
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/resend-verification", resendVerification);

router.post("/login", loginUser);

//  ---------------  LOGOUT -----------------
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

//  ----------------  PROFILE ---------------
router.get("/profile", isLoggedIn, userProfile);


//  ----------------- UPDATE PORTFOLIO  -------
router.post("/profile/update", isLoggedIn, userUpdateProfile);

// ----------------- MY ORDERS ----------------
router.get("/my-orders", isLoggedIn, userMyOrder);



router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;
