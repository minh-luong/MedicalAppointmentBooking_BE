const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// Create new appointment
router.post('/create', async (req, res) => {
    try {
        const { user_id, doctor_id, appointment_time, symptoms, status } = req.body;

        const sql = `
            INSERT INTO appointments (user_id, doctor_id, appointment_time, symptoms, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [user_id, doctor_id, appointment_time, symptoms, status || 'Pending']);
        res.status(200).json({ message: 'Appointment created', appointment_id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

//Get all appointments
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        const sql = `SELECT 
            a.appointment_id,
            a.user_id,
            a.doctor_id,
            a.appointment_time,
            a.symptoms,
            a.status,
            a.created_at,
            u.full_name AS doctor_name,
            c.name AS clinic_name
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            JOIN users u ON d.doctor_id = u.user_id
            JOIN clinics c ON d.clinic_id = c.clinic_id
            WHERE a.user_id = ?
            ORDER BY a.appointment_time DESC
            LIMIT 10`;

        const [results] = await db.query(sql, [user_id]);
        res.status(200).json({ data: results });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
    const sql = `SELECT * FROM appointments WHERE appointment_id = ?`;

    const [result] = await db.query(sql, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ message: 'Appointment not found' });
    res.json(result[0]);
});

// Get appointments for a user
router.get('/user/:user_id', async (req, res) => {
    const sql = `SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_time DESC`;

    const [results] = await db.query(sql, [req.params.user_id]);
    res.json(results);
});

// Update appointment
router.put('/:id', async (req, res) => {
    const { appointment_time, symptoms, status } = req.body;

    const sql = `
    UPDATE appointments
    SET appointment_time = ?, symptoms = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE appointment_id = ?
  `;

    await db.query(sql, [appointment_time, symptoms, status, req.params.id]);
    res.json({ message: 'Appointment updated' });
});

// Delete appointment
router.delete('/:id', async (req, res) => {
    const sql = `DELETE FROM appointments WHERE appointment_id = ?`;

    await db.query(sql, [req.params.id]);
    res.json({ message: 'Appointment deleted' });
});

module.exports = router;
