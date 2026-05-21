const express = require('express');
const cors = require('cors');

// Initialize DB (this triggers table creation on first run)
require('./config/db');

const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Appointment Booking API is running',
  });
});

// Routes
app.use('/api/appointments', appointmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
