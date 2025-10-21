const express = require('express');
const router = express.Router();
const controller = require('../controllers/clinicController');

// Get all clinics
router.get('/', controller.getAll);

// Get clinic by name
router.get('/search', controller.getByName);

module.exports = router;
