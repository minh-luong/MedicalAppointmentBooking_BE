const db = require('../db');
const authController = require('./authController');

const doctorController = {
    getBySpecialty: async (req, res) => {
        try {
            if(!(await authController.validateToken(req))) {
                return res.status(410).json({ message: 'Unauthorized' });
            }

            const { specialty_id } = req.query;

            if (!specialty_id) {
            return res.status(400).json({ message: 'Specialty ID is required' });
            }
            
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
        } 
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = doctorController;