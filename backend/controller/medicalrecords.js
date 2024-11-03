// ./controller/medicalrecords.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

// Create a new medical record
async function createMedicalRecord(req, res) {
  const { diseaseHistory, allergies, blood_type, doctor_id, patient_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO MedicalRecords (diseaseHistory, allergies, blood_type, doctor_id, patient_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [diseaseHistory, allergies, blood_type, doctor_id, patient_id]
    );

    const newRecord = result.rows[0];
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all medical records
async function getAllMedicalRecords(req, res) {
  try {
    const result = await pool.query("SELECT * FROM MedicalRecords");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a medical record by ID
async function getMedicalRecordById(req, res) {
  const { record_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM MedicalRecords WHERE record_id = $1", [record_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a medical record by ID
async function updateMedicalRecordById(req, res) {
  const { record_id } = req.params;
  const { diseaseHistory, allergies, blood_type, doctor_id, patient_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE MedicalRecords 
       SET diseaseHistory = $1, allergies = $2, blood_type = $3, doctor_id = $4, patient_id = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE record_id = $6 RETURNING *`,
      [diseaseHistory, allergies, blood_type, doctor_id, patient_id, record_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a medical record by ID
async function deleteMedicalRecordById(req, res) {
  const { record_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM MedicalRecords WHERE record_id = $1 RETURNING *", [record_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecordById,
  deleteMedicalRecordById,
};
