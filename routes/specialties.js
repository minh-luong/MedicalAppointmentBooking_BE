const express = require('express');
const router = express.Router();
const controller = require('../controllers/specialtyController');

// Create a new specialty
router.post('/create', controller.create);

// Get all specialties
router.get('/', controller.getAll);

// Get a single specialty by ID
router.get('/get/:id', controller.getById);

// Update a specialty
router.post('/update/:id', controller.update);

// Delete a specialty
router.post('/delete/:id', controller.delete);

module.exports = router;
