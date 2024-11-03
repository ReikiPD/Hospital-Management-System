// controllers/appointment.js
const Joi = require("joi");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define validation schema
const appointmentSchema = Joi.object({
  date: Joi.date().required(),
  time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:MM format
  reason: Joi.string().required(),
  status: Joi.string().default("Scheduled"),
  doctor_id: Joi.number().integer().required(),
  patient_id: Joi.number().integer().required(),
});

async function createAppointment(req, res) {
  const { error, value } = appointmentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { date, time, reason, status, doctor_id, patient_id } = value;

  try {
    // Check doctor availability
    const availabilityQuery = `
      SELECT * FROM DoctorAvailability 
      WHERE doctor_id = $1 
        AND available_date = $2 
        AND start_time <= $3 
        AND end_time >= $3
    `;
    const availabilityResult = await pool.query(availabilityQuery, [doctor_id, date, time]);

    if (availabilityResult.rows.length === 0) {
      return res.status(400).json({ error: "Doctor is not available at the requested time" });
    }

    // Check if the time slot is already booked
    const appointmentQuery = `
      SELECT * FROM Appointment 
      WHERE doctor_id = $1 
        AND date = $2 
        AND time = $3
    `;
    const appointmentResult = await pool.query(appointmentQuery, [doctor_id, date, time]);

    if (appointmentResult.rows.length > 0) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    // If available, create the appointment
    const result = await pool.query(
      "INSERT INTO Appointment (date, time, reason, status, doctor_id, patient_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [date, time, reason, status, doctor_id, patient_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
};

// Get all appointments
async function getAllAppointments(req, res) {
  try {
    const result = await pool.query("SELECT * FROM Appointment");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get an appointment by ID
async function getAppointmentById(req, res) {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM Appointment WHERE appointment_id = $1", [appointment_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Update an appointment by ID
async function updateAppointmentById(req, res) {
  const { appointment_id } = req.params;
  const { date, time, reason, status, doctor_id, patient_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE Appointment 
       SET date = $1, time = $2, reason = $3, status = $4, doctor_id = $5, patient_id = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE appointment_id = $7 RETURNING *`,
      [date, time, reason, status, doctor_id, patient_id, appointment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Delete an appointment by ID
async function deleteAppointmentById(req, res) {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query("DELETE FROM Appointment WHERE appointment_id = $1 RETURNING *", [appointment_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
};
