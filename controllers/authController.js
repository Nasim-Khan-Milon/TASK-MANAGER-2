const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (username,email,password) VALUES (?,?,?)",
      [username, email, hash]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials! Password incorrect" });
    }

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role
    });

    const refreshToken = generateRefreshToken(user);

    await db.execute(
      "UPDATE users SET refresh_token=? WHERE id=?",
      [refreshToken, user.id]
    );

    res.json({ accessToken, refreshToken });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE id=? AND refresh_token=?",
      [decoded.id, token]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = rows[0];

    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role
    });

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

const logout = async (req, res) => {
  try {
    await db.execute(
      "UPDATE users SET refresh_token=NULL WHERE id=?",
      [req.user.id]
    );

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    register, 
    login, 
    refreshToken, 
    logout 
};