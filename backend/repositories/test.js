const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:xO0jJZKIYn7h@ep-late-dawn-a1c4tr2k.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
});

pool.connect().then(() => {
  console.log("Connected to PostgreSQL database");
});

async function testInput(req, res) {
  const { column1, column2 } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO test_table (column1, column2) VALUES ($1, $2) RETURNING *",
      [column1, column2]
    );

    const addData = result.rows[0];
    res.status(201).json(addData);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  testInput,
};
