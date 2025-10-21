const db = require('../db');
const authController = require('./authController');


const notificationController = {
    create: async (req, res) => {
        try {
            // if(!(await authController.validateToken(req))) {
            //     return res.status(410).json({ message: 'Unauthorized' });
            // }

            const { user_id, title, message, type } = req.body;

            const sql = `
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (?, ?, ?, ?)
            `;

            const [result] = await db.query(sql, [user_id, title, message, type]);
            res.status(200).json({ message: 'Notification created', notification_id: result.insertId });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },
    getAll: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { user_id } = req.body;

            const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
            const [notifications] = await db.query(sql, [user_id]);
            res.status(200).json({ "data": notifications });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },
    getUnreadCount: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { user_id } = req.body;
            const sql = `SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0`;
            const [result] = await db.query(sql, [user_id]);
            res.status(200).json({ "data": result[0] });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = notificationController;