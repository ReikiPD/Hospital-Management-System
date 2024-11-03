const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

async function createPatient(req, res) {
  const {
    name,
    address,
    dateOfBirth,
    gender,
    phone,
    email,
    emergency_contact,
    admin_id,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Patient (name, address, dateOfBirth, gender, phone, email, emergency_contact, admin_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        name,
        address,
        dateOfBirth,
        gender,
        phone,
        email,
        emergency_contact,
        admin_id,
      ]
    );

    const newPatient = result.rows[0];
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllPatient(req, res) {
  try {
    const result = await pool.query("SELECT * FROM Patient");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPatientById(req, res) {
  const { patient_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM Patient WHERE patient_id = $1",
      [patient_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updatePatientById(req, res) {
  const { patient_id } = req.params;
  const {
    name,
    address,
    dateOfBirth,
    gender,
    phone,
    email,
    emergency_contact,
    admin_id,
  } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Patient SET name = $1, address = $2, dateOfBirth = $3, gender = $4, phone = $5, email = $6, emergency_contact = $7, admin_id  = $8 WHERE patient_id = $9 RETURNING *",
      [
        name,
        address,
        dateOfBirth,
        gender,
        phone,
        email,
        emergency_contact,
        admin_id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Patient not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePatientById(req, res) {
  const { patient_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM Patient WHERE patient_id = $1 RETURNING *",
      [patient_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createPatient,
  getAllPatient,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
