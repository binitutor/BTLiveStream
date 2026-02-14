const { initDatabase, pool } = require('../config/database');

// Initialize database tables
const main = async () => {
  try {
    console.log('Starting database initialization...');
    await initDatabase();
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main();
