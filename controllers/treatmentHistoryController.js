const db = require('../db');
const authController = require('./authController');

const treatmentHistoryController = {
    // Create treatment history
    create: async (req, res) => {
        try {
            console.log(req.body);

            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { appointment_id, diagnosis, treatment, prescription, notes } = req.body;

            const [check] = await db.query(
                `SELECT users.user_id, firebase_uid, appointment_time FROM users JOIN appointments ON users.user_id = appointments.user_id WHERE appointments.appointment_id = ?`,
                [appointment_id]
            );
            if (check.length === 0)
                return res.status(404).json({ message: 'Appointment not found' });

            const [result] = await db.query(
                `INSERT INTO treatment_histories (appointment_id, diagnosis, treatment, prescription, notes)
                VALUES (?, ?, ?, ?, ?)`,
                [appointment_id, diagnosis, treatment, prescription, notes]
            );
            await db.query(
                `UPDATE appointments SET status = 'completed' WHERE appointment_id = ?`,
                [appointment_id]
            );

            res.status(200).json({
                message: 'Treatment history added',
                history_id: result.insertId,
                user_id: check[0].user_id,
                user_uid: check[0].firebase_uid,
                appointment_time: check[0].appointment_time
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get by ID
    getById: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const [rows] = await db.query(`SELECT * FROM treatment_histories WHERE history_id = ?`, [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
            res.status(200).json({ "data": rows[0] });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get by appointment ID
    getByAppointment: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const [rows] = await db.query(`SELECT * FROM treatment_histories WHERE appointment_id = ?`, [req.params.appointment_id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
            res.status(200).json({ "data": rows[0] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get histories by user ID
    getByUser: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { user_id } = req.body;

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
            res.status(200).json({ "data": results });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update treatment history
    update: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { appointment_id, diagnosis, treatment, prescription, notes } = req.body;

            const [check] = await db.query(
                `SELECT users.user_id, firebase_uid, appointment_time FROM users JOIN appointments ON users.user_id = appointments.user_id WHERE appointments.appointment_id = ?`,
                [appointment_id]
            );
            if (check.length === 0)
                return res.status(404).json({ message: 'Appointment not found' });

            await db.query(
                `UPDATE treatment_histories SET diagnosis=?, treatment=?, prescription=?, notes=? WHERE history_id=?`,
                [diagnosis, treatment, prescription, notes, req.params.id]
            );
            await db.query(
                `UPDATE appointments SET status = 'completed' WHERE appointment_id = ?`,
                [appointment_id]
            );
            
            res.status(200).json({
                message: 'Treatment history updated',
                user_id: check[0].user_id,
                user_uid: check[0].firebase_uid,
                appointment_time: check[0].appointment_time
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete treatment history
    delete: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            await db.query(`DELETE FROM treatment_histories WHERE history_id = ?`, [req.params.id]);
            res.status(200).json({ message: 'Treatment history deleted' });
        } 
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = treatmentHistoryController;