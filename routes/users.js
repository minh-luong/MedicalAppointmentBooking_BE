const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/register', async (req, res) => {
    try {
        const { firebase_uid, full_name, email, phone_number, gender, date_of_birth, address, role } = req.body;

        // Validate required fields
        if (!firebase_uid || !full_name || !email || !phone_number || !gender || !date_of_birth || !address || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate phone number format (simple check, can be improved)
        const phoneRegex = /^\d{10}$/; // Assuming 10-digit phone numbers
        if (!phoneRegex.test(phone_number)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Validate date of birth format (YYYY-MM-DD)
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobRegex.test(date_of_birth)) {
            return res.status(400).json({ message: 'Invalid date of birth format' });
        }

        // Validate role
        const validRoles = ['user', 'doctor', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if the user is an admin
        if (role === 'admin') {
            // Admin-specific logic (if any)
        }

        // Insert new user
        await db.execute(`
            INSERT INTO users (firebase_uid, full_name, email, phone_number, gender, date_of_birth, address, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [firebase_uid, full_name, email, phone_number, gender, date_of_birth, address, role]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
// This file defines the user-related routes for the API.
// It includes routes for getting and updating user profiles, protected by a token verification middleware.