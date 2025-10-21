const db = require('../db');
const authController = require('./authController');

const reminderController = {
    // Create reminder
    create: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const {
                user_id, name, dosage, times_per_day,
                reminder_time, start_date, end_date,
                status = 'active', notes
            } = req.body;

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
    },

    // Get reminders by user
    getByUser: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { user_id } = req.body;
            const [results] = await db.query(
                `SELECT * FROM medication_reminders WHERE user_id = ? ORDER BY start_date DESC`,
                [user_id]
            );
            res.status(200).json({ "data": results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update a reminder
    update: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { reminder_id } = req.params;
            const data = req.body;
            const [result] = await db.query(
                `UPDATE medication_reminders SET ? WHERE reminder_id = ?`,
                [data, reminder_id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Reminder not found' });
            }
            res.status(200).json({ message: 'Reminder updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete a reminder
    delete: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { reminder_id } = req.params;
            const [result] = await db.query(
                `DELETE FROM medication_reminders WHERE reminder_id = ?`,
                [reminder_id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Reminder not found' });
            }
            res.status(200).json({ message: 'Reminder deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = reminderController;