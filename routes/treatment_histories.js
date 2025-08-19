const express = require('express');
const router = express.Router();
const db = require('../db'); // your DB connection module

// CREATE treatment history
router.post('/', async (req, res) => {
  const { appointment_id, diagnosis, treatment, prescription, notes } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO treatment_histories (appointment_id, diagnosis, treatment, prescription, notes)
             VALUES (?, ?, ?, ?, ?)`,
      [appointment_id, diagnosis, treatment, prescription, notes]
    );
    res.status(201).json({ message: 'Treatment history added', history_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM treatment_histories WHERE history_id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get histories by user ID
router.get('/get/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const [results] = await db.query(
      `SELECT th.*, u.full_name AS doctor_name, s.name AS specialty_name
      FROM treatment_histories th
      JOIN appointments a ON th.appointment_id = a.appointment_id
      JOIN users u ON a.doctor_id = u.user_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN specialties s ON d.specialty_id = s.specialty_id
      WHERE a.user_id = ? ORDER BY updated_at DESC`,
      [user_id]
    );
    res.status(200).json({"data": results});
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.post('/update/:id', async (req, res) => {
  const { diagnosis, treatment, prescription, notes } = req.body;

  try {
    await db.query(
      `UPDATE treatment_histories SET diagnosis=?, treatment=?, prescription=?, notes=? WHERE history_id=?`,
      [diagnosis, treatment, prescription, notes, req.params.id]
    );
    res.json({ message: 'Treatment history updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.post('/delete/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM treatment_histories WHERE history_id = ?`, [req.params.id]);
    res.json({ message: 'Treatment history deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
