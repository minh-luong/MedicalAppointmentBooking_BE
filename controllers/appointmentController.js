const db = require('../db');
const authController = require('./authController');

const appointmentController = {
  // Create new appointment
  create: async (req, res) => {
    try {
        const { user_id, doctor_id, appointment_time, symptoms, status } = req.body;

        if(!(await authController.validateToken(req))) {
            return res.status(410).json({ message: 'Unauthorized' });
        }

        // check conflict appointment
        const [conflict] = await db.query(
            `SELECT * FROM appointments WHERE doctor_id = ? AND appointment_time = ?`,
            [doctor_id, appointment_time]
        );
        if (conflict.length > 0) {
            return res.status(409).json({ message: 'Appointment conflict detected' });
        }

        const sql = `
            INSERT INTO appointments (user_id, doctor_id, appointment_time, symptoms, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [user_id, doctor_id, appointment_time, symptoms, status || 'pending']);

        // Get doctor firebase uid
        const [doctor] = await db.query(`SELECT user_id, firebase_uid FROM users WHERE user_id = ?`, [doctor_id]);

        res.status(200).json({ 
            message: 'Appointment created', 
            appointment_id: result.insertId,
            doctor_id: doctor[0].user_id,
            doctor_uid: doctor[0].firebase_uid
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
  },

  // Get appointment by ID
  getById: async (req, res) => {
    try {
      if(!(await authController.validateToken(req))) {
          return res.status(410).json({ message: 'Unauthorized' });
      }

      const sql = `SELECT * FROM appointments WHERE appointment_id = ?`;
      const [result] = await db.query(sql, [req.params.id]);
      
      if (result.length === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.status(200).json({ data: result[0] });
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get upcoming appointments for a user
  getUpcomingByUser: async (req, res) => {
    try {
        if(!(await authController.validateToken(req))) {
            return res.status(410).json({ message: 'Unauthorized' });
        }

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
            WHERE a.user_id = ? AND a.status = 'pending'
            ORDER BY a.appointment_time DESC`;

        const [results] = await db.query(sql, [user_id]);
        res.status(200).json({ data: results });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
  },

  // Get appointments for a doctor
  getByDoctor: async (req, res) => {
    try {
        if(!(await authController.validateToken(req))) {
            return res.status(410).json({ message: 'Unauthorized' });
        }

        const doctor_id = req.body.user_id;

        const sql = `SELECT 
            a.appointment_id,
            a.user_id,
            a.doctor_id,
            a.appointment_time,
            a.symptoms,
            a.status,
            a.created_at,
            u.full_name AS patient_name
            FROM appointments a
            JOIN users u ON a.user_id = u.user_id
            WHERE a.doctor_id = ? AND a.status != 'cancelled'
            ORDER BY a.appointment_time DESC`;

        const [results] = await db.query(sql, [doctor_id]);
        res.status(200).json({ data: results });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
  },

  // Update appointment time
  updateTime: async (req, res) => {
    try {
        if(!(await authController.validateToken(req))) {
            return res.status(410).json({ message: 'Unauthorized' });
        }

        const { appointment_time } = req.body;

        const [appointment] = await db.query(`SELECT * FROM appointments WHERE appointment_id = ?`, [req.params.id]);
        if (appointment.length === 0) 
            return res.status(404).json({ message: 'Appointment not found' });

        const [doctor] = await db.query(`SELECT user_id, firebase_uid FROM users WHERE user_id = ?`, [appointment[0].doctor_id]);
        const sql = `
            UPDATE appointments
            SET appointment_time = ?, updated_at = CURRENT_TIMESTAMP
            WHERE appointment_id = ?
            `;

        await db.query(sql, [appointment_time, req.params.id]);
        res.status(200).json({ 
            message: 'Appointment updated', 
            doctor_id: doctor[0].user_id, 
            doctor_uid: doctor[0].firebase_uid 
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
  },

  // Cancel appointment
  cancel: async (req, res) => {
    try {
        if(!(await authController.validateToken(req))) {
            return res.status(410).json({ message: 'Unauthorized' });
        }

        const sql = `
            UPDATE appointments
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE appointment_id = ?
        `;

        await db.query(sql, [req.params.id]);
        res.status(200).json({ message: 'Appointment cancelled' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
  },

  // Delete appointment
  delete: async (req, res) => {
    try {
      if(!(await authController.validateToken(req))) {
          return res.status(410).json({ message: 'Unauthorized' });
      }

      const sql = `DELETE FROM appointments WHERE appointment_id = ?`;
      await db.query(sql, [req.params.id]);
      res.status(200).json({ message: 'Appointment deleted' });
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = appointmentController;