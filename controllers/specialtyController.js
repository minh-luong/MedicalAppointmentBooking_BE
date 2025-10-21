const db = require('../db');

const specialtyController = {
    create: async (req, res) => {
        try {
            const { name, description } = req.body;
            const [result] = await db.query(
                'INSERT INTO specialties (name, description) VALUES (?, ?)',
                [name, description]
            );
            res.status(200).json({ message: 'Specialty created', specialty_id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const [results] = await db.query('SELECT * FROM specialties ORDER BY name');
            res.status(200).json({ data: results });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const [results] = await db.query('SELECT * FROM specialties WHERE specialty_id = ?', [req.params.id]);

            if (results.length === 0) {
                return res.status(404).json({ message: 'Specialty not found' });
            }

            res.status(200).json(results[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const { name, description } = req.body;
            await db.query(
                'UPDATE specialties SET name = ?, description = ? WHERE specialty_id = ?',
                [name, description, req.params.id]
            );
            res.status(200).json({ message: 'Specialty updated' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            await db.query('DELETE FROM specialties WHERE specialty_id = ?', [req.params.id]);
            res.status(200).json({ message: 'Specialty deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = specialtyController;