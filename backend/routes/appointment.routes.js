const express = require('express');
const appointmentController = require('../controllers/appointment.controller');

const router = express.Router();

// GET    /api/appointments         -> list (supports ?search= and ?status=)
// GET    /api/appointments/:id     -> get one
// POST   /api/appointments         -> create
// PUT    /api/appointments/:id     -> update
// DELETE /api/appointments/:id     -> delete
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.remove);

module.exports = router;
