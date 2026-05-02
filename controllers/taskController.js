const db = require("../config/db");

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    await db.execute(
      "INSERT INTO tasks (title,description,status,user_id) VALUES (?,?,?,?)",
      [title, description || "", status || "Pending", req.user.id]
    );

    res.status(201).json({ message: "Task created" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, q, page = 1, limit = 5 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    let sql = "SELECT * FROM tasks WHERE user_id=?";
    let params = [req.user.id];

    if (status) {
      sql += " AND status=?";
      params.push(status);
    }

    if (q) {
      sql += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ` ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [rows] = await db.execute(sql, params);

    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM tasks WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const [result] = await db.execute(
  "UPDATE tasks SET title=?,description=?,status=? WHERE id=? AND user_id=?",
  [
    title ?? null,
    description ?? null,
    status ?? null,
    req.params.id,
    req.user.id
  ]
);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM tasks WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.json({ message: "Task deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};