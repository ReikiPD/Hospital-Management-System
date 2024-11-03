// loginHistoryController.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://username:password@localhost:5432/yourdatabase",
});

// Create a new login record
async function createLoginRecord(req, res) {
  const { user_id, login_status, ip_address } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO LoginHistory (user_id, login_status, ip_address) VALUES ($1, $2, $3) RETURNING *",
      [user_id, login_status, ip_address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all login records
async function getAllLoginRecords(req, res) {
  try {
    const result = await pool.query("SELECT * FROM LoginHistory");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get login record by login_id
async function getLoginRecordById(req, res) {
  const { login_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM LoginHistory WHERE login_id = $1", [login_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Login record not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update login record by login_id
async function updateLoginRecord(req, res) {
  const { login_id } = req.params;
  const { login_status, ip_address } = req.body;

  try {
    const result = await pool.query(
      "UPDATE LoginHistory SET login_status = $1, ip_address = $2 WHERE login_id = $3 RETURNING *",
      [login_status, ip_address, login_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Login record not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete login record by login_id
async function deleteLoginRecord(req, res) {
  const { login_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM LoginHistory WHERE login_id = $1 RETURNING *", [login_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Login record not found" });
    }

    res.status(200).json({ message: "Login record deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fungsi logout untuk mencatat waktu logout di LoginHistory
async function logout(req, res) {
    const { login_id } = req.params;
  
    try {
      const result = await pool.query(
        "UPDATE LoginHistory SET logout_time = CURRENT_TIMESTAMP WHERE login_id = $1 RETURNING *",
        [login_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Login record not found" });
      }
  
      res.status(200).json({ message: "Logout recorded successfully", data: result.rows[0] });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  module.exports = {
    createLoginRecord,
    getAllLoginRecords,
    getLoginRecordById,
    updateLoginRecord,
    deleteLoginRecord,
    logout,  // Tambahkan fungsi logout di sini
  };
  