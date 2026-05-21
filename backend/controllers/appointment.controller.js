const appointmentService = require('../services/appointment.service');

const VALID_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

// Reusable validator for create + update payloads
function validateAppointmentPayload(body) {
  const errors = [];

  // Customer name
  if (!body.customer_name || typeof body.customer_name !== 'string') {
    errors.push('Customer name is required');
  } else if (body.customer_name.trim().length === 0) {
    errors.push('Customer name cannot be empty');
  }

  // Appointment date
  if (!body.appointment_date) {
    errors.push('Appointment date is required');
  } else {
    const date = new Date(body.appointment_date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid appointment date');
    } else if (date.getTime() <= Date.now()) {
      errors.push('Appointment date must be in the future');
    }
  }

  // Status (optional on create, defaults to Pending)
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return errors;
}

// GET /api/appointments
function getAll(req, res) {
  try {
    const { search, status } = req.query;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const appointments = appointmentService.getAll(search, status);
    res.json(appointments);
  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
}

// GET /api/appointments/:id
function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = appointmentService.getById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (err) {
    console.error('getById error:', err);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
}

// POST /api/appointments
function create(req, res) {
  try {
    const errors = validateAppointmentPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('. ') });
    }

    const appointment = appointmentService.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    if (err.code === 'DUPLICATE') {
      return res.status(409).json({
        error:
          'An appointment already exists for this customer at this date and time',
      });
    }
    console.error('create error:', err);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
}

// PUT /api/appointments/:id
function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const errors = validateAppointmentPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('. ') });
    }

    const appointment = appointmentService.update(id, req.body);
    res.json(appointment);
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (err.code === 'DUPLICATE') {
      return res.status(409).json({
        error:
          'An appointment already exists for this customer at this date and time',
      });
    }
    console.error('update error:', err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
}

// DELETE /api/appointments/:id
function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    appointmentService.remove(id);
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    console.error('delete error:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
