const { Pool } = require("pg");
const { connectionString } = require("pg/lib/defaults");

const pool = new Pool({
    connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

async function createPatient(req, res) {
    const {name, address, dateOfBirth, gender, phone, email, emergency_contact, registration_date, admin_id} = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO Patient (name, address, dateOfBirth, gender, phone, email, emergency_contact, registration_date, admin_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, address, dateOfBirth, gender, phone, email, emergency_contact, registration_date, admin_id] 
        );

        const newPatient = result.rows[0];
        res.status(201).json(newPatient);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}
