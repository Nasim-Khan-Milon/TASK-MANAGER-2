const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "15m" });

exports.generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });