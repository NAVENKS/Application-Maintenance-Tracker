require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ This forces every connection to use public schema
pool.on('connect', (client) => {
  client.query('SET search_path TO public');
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    client.query('SET search_path TO public');
    console.log('✅ Database connected successfully to Neon!');
    release();
  }
});

module.exports = pool;