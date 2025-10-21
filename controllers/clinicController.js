const db = require('../db');

const clinicController = {
    // Get all clinics
    getAll: async (req, res) => {
        try {
            const [results] = await db.query('SELECT * FROM clinics ORDER BY name');
            res.status(200).json({ data: results });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get clinic by name
    getByName: async (req, res) => {
        const { name } = req.query;
        try {
            const [results] = await db.query('SELECT * FROM clinics WHERE name LIKE ?', [`%${name}%`]);
            if (results.length === 0) return res.status(404).json({ message: 'Clinic not found' });
            res.status(200).json({ data: results });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = clinicController;
