const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

async function signupUser(req, res) {

    const { username, email, password } = req.body;

    try{

       const result =  await pool.query("INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING *", 
        [username, email, password]);
       
       const newAccount = result.rows[0];
       res.status(201).json(newAccount);
    } catch (err) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function signupAdmin(req, res) {

    const { username, email, password } = req.body;

    try{

       const result =  await pool.query("INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'admin') RETURNING *", 
        [username, email, password]);
       
       const newAccount = result.rows[0];
       res.status(201).json(newAccount);
    } catch (err) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    signupUser,
    signupAdmin,
};