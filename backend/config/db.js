const Database = require('better-sqlite3');
const path = require('path');

// Open/create the SQLite database file in the backend root
const dbPath = path.join(__dirname, '..', 'appointments.db');
const db = new Database(dbPath);

// Better concurrency for reads
db.pragma('journal_mode = WAL');

// Create the appointments table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending'
      CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (customer_name, appointment_date)
  )
`);

console.log('SQLite database connected at:', dbPath);

module.exports = db;
