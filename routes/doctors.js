const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// Get a single doctor by specialty
router.get('/', async (req, res) => {
  const { specialty_id } = req.query;

  if (!specialty_id) {
    return res.status(400).json({ message: 'Specialty ID is required' });
  }

  try {
    const [doctors] = await db.query(
        `SELECT 
        d.doctor_id,
        u.full_name,
        u.email,
        u.phone_number,
        u.gender,
        u.date_of_birth,
        u.address,
        d.clinic_id,
        d.specialty_id,
        d.bio,
        d.created_at
        FROM doctors d
        JOIN users u ON d.doctor_id = u.user_id
        WHERE d.specialty_id = ?`,
      [specialty_id]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found for this specialty' });
    }

    res.status(200).json({ data: doctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;