// testResult.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});


// Create a new test result
async function createTestResult(req, res) {
  const { patient_id, doctor_id, test_name, test_date, result, notes } = req.body;

  try {
    const resultData = await pool.query(
      "INSERT INTO testResult (patient_id, doctor_id, test_name, test_date, result, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [patient_id, doctor_id, test_name, test_date, result, notes]
    );

    const newTestResult = resultData.rows[0];
    res.status(201).json(newTestResult);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all test results
async function getAllTestResults(req, res) {
  try {
    const resultData = await pool.query("SELECT * FROM testResult");
    res.status(200).json(resultData.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a test result by ID
async function getTestResultById(req, res) {
  const { test_id } = req.params;

  try {
    const resultData = await pool.query("SELECT * FROM testResult WHERE test_id = $1", [test_id]);

    if (resultData.rows.length === 0) {
      return res.status(404).json({ message: "Test result not found" });
    }

    res.status(200).json(resultData.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a test result by ID
async function updateTestResultById(req, res) {
  const { test_id } = req.params;
  const { patient_id, doctor_id, test_name, test_date, result, notes } = req.body;

  try {
    const resultData = await pool.query(
      "UPDATE testResult SET patient_id = $1, doctor_id = $2, test_name = $3, test_date = $4, result = $5, notes = $6 WHERE test_id = $7 RETURNING *",
      [patient_id, doctor_id, test_name, test_date, result, notes, test_id]
    );

    if (resultData.rows.length === 0) {
      return res.status(404).json({ message: "Test result not found" });
    }

    res.status(200).json(resultData.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a test result by ID
async function deleteTestResultById(req, res) {
  const { test_id } = req.params;

  try {
    const resultData = await pool.query("DELETE FROM testResult WHERE test_id = $1 RETURNING *", [test_id]);

    if (resultData.rows.length === 0) {
      return res.status(404).json({ message: "Test result not found" });
    }

    res.status(200).json({ message: "Test result deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createTestResult,
  getAllTestResults,
  getTestResultById,
  updateTestResultById,
  deleteTestResultById,
};
