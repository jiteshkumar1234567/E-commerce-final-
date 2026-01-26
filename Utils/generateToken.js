const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is not defined in .env");
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_KEY,
    { expiresIn: "7d" }
  );
};

module.exports.generateToken = generateToken;
