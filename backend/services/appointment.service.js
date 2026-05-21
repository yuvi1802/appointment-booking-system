const db = require('../config/db');

// Get all appointments with optional search + status filter
function getAll(search, status) {
  let query = 'SELECT * FROM appointments';
  const conditions = [];
  const params = [];

  if (search && search.trim()) {
    conditions.push('LOWER(customer_name) LIKE ?');
    params.push(`%${search.trim().toLowerCase()}%`);
  }

  if (status && status.trim()) {
    conditions.push('status = ?');
    params.push(status.trim());
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY appointment_date DESC';

  return db.prepare(query).all(...params);
}

// Get a single appointment by ID
function getById(id) {
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
}

// Create a new appointment
function create(data) {
  const customer_name = data.customer_name.trim();
  const { appointment_date, status } = data;

  // Check duplicate manually for a clean 409 error (DB UNIQUE is a safety net)
  const existing = db
    .prepare(
      'SELECT id FROM appointments WHERE customer_name = ? AND appointment_date = ?'
    )
    .get(customer_name, appointment_date);

  if (existing) {
    const err = new Error('Duplicate appointment');
    err.code = 'DUPLICATE';
    throw err;
  }

  const result = db
    .prepare(
      `INSERT INTO appointments (customer_name, appointment_date, status)
       VALUES (?, ?, ?)`
    )
    .run(customer_name, appointment_date, status || 'Pending');

  return getById(result.lastInsertRowid);
}

// Update an existing appointment
function update(id, data) {
  const existing = getById(id);
  if (!existing) {
    const err = new Error('Appointment not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const customer_name = data.customer_name.trim();
  const { appointment_date, status } = data;

  // Check duplicate against OTHER rows (exclude current row)
  const duplicate = db
    .prepare(
      `SELECT id FROM appointments
       WHERE customer_name = ? AND appointment_date = ? AND id != ?`
    )
    .get(customer_name, appointment_date, id);

  if (duplicate) {
    const err = new Error('Duplicate appointment');
    err.code = 'DUPLICATE';
    throw err;
  }

  db.prepare(
    `UPDATE appointments
     SET customer_name = ?, appointment_date = ?, status = ?
     WHERE id = ?`
  ).run(customer_name, appointment_date, status, id);

  return getById(id);
}

// Delete an appointment
function remove(id) {
  const existing = getById(id);
  if (!existing) {
    const err = new Error('Appointment not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
  return { success: true };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
