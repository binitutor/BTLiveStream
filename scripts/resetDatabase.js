const { pool } = require('../config/database');

// Drop all tables to reset the database
const dropTables = async () => {
  const client = await pool.connect();
  try {
    console.log('Dropping existing tables...');
    
    // Drop tables in reverse order of dependencies
    await client.query('DROP TABLE IF EXISTS support_responses CASCADE;');
    await client.query('DROP TABLE IF EXISTS support_tickets CASCADE;');
    await client.query('DROP TABLE IF EXISTS call_analytics CASCADE;');
    await client.query('DROP TABLE IF EXISTS session_participants CASCADE;');
    await client.query('DROP TABLE IF EXISTS livestream_sessions CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const main = async () => {
  try {
    await dropTables();
    console.log('Database reset completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main();
