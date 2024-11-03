// admin.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

// Create a new admin
async function createAdmin(req, res) {
  const { username, password, email, phone } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Admin (username, password, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, password, email, phone]
    );

    const newAdmin = result.rows[0];
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllAdmin(req, res) {
    try {
      const result = await pool.query("SELECT * FROM Admin");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

// Read an admin by ID
async function getAdminById(req, res) {
  const { admin_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM Admin WHERE admin_id = $1", [admin_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update an admin by ID
async function updateAdminById(req, res) {
  const { admin_id } = req.params;
  const { username, password, email, phone } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Admin SET username = $1, password = $2, email = $3, phone = $4 WHERE admin_id = $5 RETURNING *",
      [username, password, email, phone, admin_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete an admin by ID
async function deleteAdminById(req, res) {
  const { admin_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM Admin WHERE admin_id = $1 RETURNING *", [admin_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = {
  createAdmin,
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
