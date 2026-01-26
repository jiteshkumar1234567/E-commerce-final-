const express = require("express");
const router = express.Router();
const userModel = require("../Models/user-model");

router.get("/", (req, res) => {
  res.render("index", { error: "" });
});

module.exports = router;