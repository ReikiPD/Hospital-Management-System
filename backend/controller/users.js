const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
    connectionString:
      "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  });

// Fungsi untuk membuat hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Create a new user with 'user' role
async function createUser(req, res) {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, 'user') RETURNING *",
      [username, hashedPassword, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create a new user with 'admin' role
async function createAdmin(req, res) {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, 'admin') RETURNING *",
      [username, hashedPassword, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a user by ID
async function getUserById(req, res) {
  const { user_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a user by ID
async function updateUserById(req, res) {
  const { user_id } = req.params;
  const { username, password, email, role } = req.body;

  try {
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const result = await pool.query(
      "UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), email = COALESCE($3, email), role = COALESCE($4, role) WHERE user_id = $5 RETURNING *",
      [username, hashedPassword, email, role, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a user by ID
async function deleteUserById(req, res) {
  const { user_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createUser,
  createAdmin,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
