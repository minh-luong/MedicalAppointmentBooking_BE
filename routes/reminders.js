const express = require('express');
const router = express.Router();
const db = require('../db'); // Your MySQL connection

// Create reminder
router.post('/create', async (req, res) => {
  const {
    user_id, name, dosage, times_per_day,
    reminder_time, start_date, end_date,
    status = 'active', notes
  } = req.body;

  try {
    const sql = `
      INSERT INTO medication_reminders 
      (user_id, name, dosage, times_per_day, reminder_time, start_date, end_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [user_id, name, dosage, times_per_day, reminder_time, start_date, end_date, status, notes]);
    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to create reminder' });
    }
    res.status(200).json({ message: 'Reminder created', reminder_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reminders by user
router.get('/get/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const [results] = await db.query(
      `SELECT * FROM medication_reminders WHERE user_id = ? ORDER BY start_date DESC`,
      [user_id]
    );
    res.json({"data": results});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a reminder
router.post('/update/:reminder_id', async (req, res) => {
  const { reminder_id } = req.params;
  const data = req.body;

  try {
    const [result] = await db.query(
      `UPDATE medication_reminders SET ? WHERE reminder_id = ?`,
      [data, reminder_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ message: 'Reminder updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a reminder
router.post('/delete/:reminder_id', async (req, res) => {
  const { reminder_id } = req.params;

  try {
    const [result] = await db.query(
      `DELETE FROM medication_reminders WHERE reminder_id = ?`,
      [reminder_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
