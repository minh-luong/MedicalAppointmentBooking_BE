const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorController');

// Get a single doctor by specialty
router.post('/', controller.getBySpecialty);

module.exports = router;