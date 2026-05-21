const Database = require('better-sqlite3');
const path = require('path');

// Open/create SQLite database
const dbPath = path.join(__dirname, '..', 'appointments.db');
const db = new Database(dbPath);

// Better concurrency
db.pragma('journal_mode = WAL');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending'
      CHECK (status IN (
        'Pending',
        'Confirmed',
        'Completed',
        'Cancelled'
      )),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (customer_name, appointment_date)
  )
`);

// Demo data
const demoAppointments = [
  {
    customer_name: 'Yuvashree M',
    appointment_date: '2026-05-22 10:00:00',
    status: 'Confirmed',
  },
  {
    customer_name: 'Balaji R',
    appointment_date: '2026-05-22 11:30:00',
    status: 'Pending',
  },
  {
    customer_name: 'Suja S',
    appointment_date: '2026-05-22 14:00:00',
    status: 'Cancelled',
  },
  {
    customer_name: 'Nithya M',
    appointment_date: '2026-05-22 16:00:00',
    status: 'Completed',
  },
  {
    customer_name: 'Sudharsan',
    appointment_date: '2026-05-23 09:30:00',
    status: 'Confirmed',
  },
  {
    customer_name: 'Sri Harini',
    appointment_date: '2026-05-23 13:00:00',
    status: 'Pending',
  },
];

const count = db
  .prepare(
    'SELECT COUNT(*) AS total FROM appointments'
  )
  .get();

if (count.total === 0) {
  const insert = db.prepare(`
    INSERT INTO appointments
    (customer_name, appointment_date, status)
    VALUES (?, ?, ?)
  `);

  demoAppointments.forEach((item) => {
    insert.run(
      item.customer_name,
      item.appointment_date,
      item.status
    );
  });

  console.log('Demo appointments inserted');
}

console.log(
  'SQLite database connected at:',
  dbPath
);

module.exports = db;