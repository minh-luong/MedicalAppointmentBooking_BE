const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// Create a new specialty
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO specialties (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(200).json({ message: 'Specialty created', specialty_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all specialties
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM specialties ORDER BY name');
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single specialty by ID
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM specialties WHERE specialty_id = ?', [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specialty
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    await db.query(
      'UPDATE specialties SET name = ?, description = ? WHERE specialty_id = ?',
      [name, description, req.params.id]
    );
    res.json({ message: 'Specialty updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a specialty
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM specialties WHERE specialty_id = ?', [req.params.id]);
    res.json({ message: 'Specialty deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
