const router = require("express").Router();
const { register, login, refreshToken, logout } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", auth, logout);

module.exports = router;