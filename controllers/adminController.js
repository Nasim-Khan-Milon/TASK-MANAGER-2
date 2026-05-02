const db = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id,username,email,role FROM users"
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM tasks");

    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnyTask = async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM tasks WHERE id=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted by admin" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const [result] = await db.execute(
      "UPDATE users SET role='admin' WHERE id=?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User promoted to admin" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getAllTasks,
  deleteAnyTask,
  makeAdmin
};