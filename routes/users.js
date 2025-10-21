const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/login_by_token', controller.loginByToken);
router.post('/register', controller.register);
router.post('/get_info', controller.getInfo);
router.post('/update_profile', controller.updateProfile);
router.post('/get_token', authController.getToken);

module.exports = router;
// This file defines the user-related routes for the API.
// It includes routes for getting and updating user profiles, protected by a token verification middleware.