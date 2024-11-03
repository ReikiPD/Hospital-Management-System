// ./controller/bill.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

// Create a new bill
async function createBill(req, res) {
  const { total, status, due_date, payment_date, patient_id, appointment_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Bill (total, status, due_date, payment_date, patient_id, appointment_id) 
       VALUES ($1, COALESCE($2, 'Unpaid'), $3, $4, $5, $6) RETURNING *`,
      [total, status, due_date, payment_date, patient_id, appointment_id]
    );

    const newBill = result.rows[0];
    res.status(201).json(newBill);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all bills
async function getAllBills(req, res) {
  try {
    const result = await pool.query("SELECT * FROM Bill");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a bill by ID
async function getBillById(req, res) {
  const { bill_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM Bill WHERE bill_id = $1", [bill_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a bill by ID
async function updateBillById(req, res) {
  const { bill_id } = req.params;
  const { total, status, due_date, payment_date, patient_id, appointment_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE Bill 
       SET total = $1, status = $2, due_date = $3, payment_date = $4, patient_id = $5, appointment_id = $6
       WHERE bill_id = $7 RETURNING *`,
      [total, status, due_date, payment_date, patient_id, appointment_id, bill_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a bill by ID
async function deleteBillById(req, res) {
  const { bill_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM Bill WHERE bill_id = $1 RETURNING *", [bill_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createBill,
  getAllBills,
  getBillById,
  updateBillById,
  deleteBillById,
};
