// check_db.js

// Load environment variables from .env file
require('dotenv').config();

// Import the Pool object from the 'pg' library
const { Pool } = require('pg');

// Create a new Pool instance to manage connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create an async function to query the database
async function listTables() {
  console.log('Connecting to the database to check tables...');
  try {
    // The query to select table names from the information_schema
    const queryText = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'app'
      ORDER BY table_name;
    `;
    
    const res = await pool.query(queryText);
    
    if (res.rows.length === 0) {
      console.log('No tables found in the "app" schema.');
    } else {
      console.log(' Success! Found the following tables in the "app" schema:');
      // Print each table name
      res.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

  } catch (err) {
    console.error(' Error executing query', err.stack);
  } finally {
    // End the pool connection
    await pool.end();
    console.log('Connection pool closed.');
  }
}

// Run the function
listTables();