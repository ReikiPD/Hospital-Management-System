// doctor.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});


// Create a new doctor
async function createDoctor(req, res) {
  const { name, specialization, contact_number, email, experience_years, admin_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Doctor (name, specialization, contact_number, email, experience_years, admin_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, specialization, contact_number, email, experience_years, admin_id]
    );

    const newDoctor = result.rows[0];
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all doctors
async function getAllDoctors(req, res) {
  try {
    const result = await pool.query("SELECT * FROM Doctor");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a doctor by ID
async function getDoctorById(req, res) {
  const { doctor_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM Doctor WHERE doctor_id = $1", [doctor_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update a doctor by ID
async function updateDoctorById(req, res) {
  const { doctor_id } = req.params;
  const { name, specialization, contact_number, email, experience_years, admin_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Doctor SET name = $1, specialization = $2, contact_number = $3, email = $4, experience_years = $5, admin_id = $6 WHERE doctor_id = $7 RETURNING *",
      [name, specialization, contact_number, email, experience_years, admin_id, doctor_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete a doctor by ID
async function deleteDoctorById(req, res) {
  const { doctor_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM Doctor WHERE doctor_id = $1 RETURNING *", [doctor_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create a new availability slot
async function createAvailability(req, res) {
  const { doctor_id, available_date, start_time, end_time } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO DoctorAvailability (doctor_id, available_date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [doctor_id, available_date, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all availability slots
async function getAllAvailabilities(req, res) {
  try {
    const result = await pool.query("SELECT * FROM DoctorAvailability");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get availability slots by doctor ID
async function getAvailabilityByDoctorId(req, res) {
  const { doctor_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM DoctorAvailability WHERE doctor_id = $1",
      [doctor_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No availability found for this doctor" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update an availability slot by availability_id
async function updateAvailabilityById(req, res) {
  const { availability_id } = req.params;
  const { available_date, start_time, end_time } = req.body;

  try {
    const result = await pool.query(
      "UPDATE DoctorAvailability SET available_date = $1, start_time = $2, end_time = $3 WHERE availability_id = $4 RETURNING *",
      [available_date, start_time, end_time, availability_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// Delete an availability slot by availability_id
async function deleteAvailabilityById(req, res) {
  const { availability_id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM DoctorAvailability WHERE availability_id = $1 RETURNING *",
      [availability_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    res.status(200).json({ message: "Availability slot deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
  createAvailability,
  getAllAvailabilities,
  getAvailabilityByDoctorId,
  updateAvailabilityById,
  deleteAvailabilityById,
};
