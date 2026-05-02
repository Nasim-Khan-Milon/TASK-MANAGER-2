const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getUsers, getAllTasks, deleteAnyTask, makeAdmin } = require("../controllers/adminController");

router.get("/users", auth, role("admin"), getUsers);
router.get("/tasks", auth, role("admin"), getAllTasks);
router.delete("/tasks/:id", auth, role("admin"), deleteAnyTask);
router.put("/make-admin/:id", auth, role("admin"), makeAdmin);

module.exports = router;