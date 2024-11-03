// medicinePrescription.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

// Create a new medicine prescription
async function createMedicinePrescription(req, res) {
  const { record_id, medicine_id, dosage_per_day, duration_days, instructions } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Medicine_Prescription (record_id, medicine_id, dosage_per_day, duration_days, instructions) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [record_id, medicine_id, dosage_per_day, duration_days, instructions]
    );

    const newPrescription = result.rows[0];
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all medicine prescriptions
async function getAllMedicinePrescriptions(req, res) {
  try {
    const result = await pool.query("SELECT * FROM Medicine_Prescription");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a specific medicine prescription by record_id and medicine_id
async function getMedicinePrescription(req, res) {
  const { record_id, medicine_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM Medicine_Prescription WHERE record_id = $1 AND medicine_id = $2",
      [record_id, medicine_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a specific medicine prescription
async function updateMedicinePrescription(req, res) {
  const { record_id, medicine_id } = req.params;
  const { dosage_per_day, duration_days, instructions } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Medicine_Prescription SET dosage_per_day = $1, duration_days = $2, instructions = $3 WHERE record_id = $4 AND medicine_id = $5 RETURNING *",
      [dosage_per_day, duration_days, instructions, record_id, medicine_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a specific medicine prescription
async function deleteMedicinePrescription(req, res) {
  const { record_id, medicine_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM Medicine_Prescription WHERE record_id = $1 AND medicine_id = $2 RETURNING *",
      [record_id, medicine_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createMedicinePrescription,
  getAllMedicinePrescriptions,
  getMedicinePrescription,
  updateMedicinePrescription,
  deleteMedicinePrescription,
};
