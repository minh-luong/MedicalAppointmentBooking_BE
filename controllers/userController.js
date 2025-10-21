const db = require('../db');
const authController = require('./authController');

const usersController = {
  // Login user by token
  loginByToken: async (req, res) => {
    try {
      const { auth_token } = req.body;
      if (!auth_token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      const [check] = await db.query('SELECT * FROM login_tokens WHERE token = ? AND expires_at > NOW()', [auth_token]);
      if (check.length === 0) {
        return res.status(404).json({ message: 'Token is invalid' });
      }

      const [user] = await db.query('SELECT * FROM users WHERE user_id = ?', [check[0].user_id]);
      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ uid: user[0].firebase_uid });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Register new user
  register: async (req, res) => {
    try {
      const { firebase_uid, full_name, email, phone_number, gender, date_of_birth, address, role, specialty_id, clinic_id } = req.body;

      // Validate required fields
      if (!firebase_uid || !full_name || !email || !gender || !date_of_birth || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const [existingUser] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid]);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (phone_number.trim() != "" && !phoneRegex.test(phone_number)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }

      // Validate date of birth format
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobRegex.test(date_of_birth)) {
        return res.status(400).json({ message: 'Invalid date of birth format' });
      }

      // Validate role
      const validRoles = ['user', 'doctor', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      // Check if email already exists for users
      const [userConflict] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (userConflict.length > 0) {
        return res.status(409).json({ message: 'Email already exists for user' });
      }

      // Insert new user
      await db.execute(
        `INSERT INTO users (firebase_uid, full_name, email, phone_number, gender, date_of_birth, address, role)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [firebase_uid, full_name, email, phone_number, gender, date_of_birth, address, role]
      );

      // Get user id
      const [newUser] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid]);
      const user_id = newUser[0].user_id;

      // If the role is doctor, additional setup can be done here
      if (role === 'doctor') {
        // Create a new entry in the doctors table
        if (!specialty_id || !clinic_id) {
          return res.status(400).json({ message: 'Specialty ID and Clinic ID are required for doctors' });
        }

        await db.execute(
          `INSERT INTO doctors (doctor_id, specialty_id, clinic_id) VALUES (?, ?, ?)`,
          [user_id, specialty_id, clinic_id]
        );
      }

      res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get user info by ID
  getInfo: async (req, res) => {
    try {
      const { uid } = req.body;

      if (!(await authController.validateToken(req))) {
        return res.status(410).json({ message: 'Unauthorized' });
      }

      const [user] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [uid]);
      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(user[0]);
      res.status(200).json({ data: user[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { user_id, full_name, phone_number, gender, date_of_birth, address } = req.body;

      console.log(req.body);

      if (!(await authController.validateToken(req))) {
        return res.status(410).json({ message: 'Unauthorized' });
      }

      // Validate required fields
      if (!full_name || !phone_number || !gender || !date_of_birth || !address) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Update user profile
      await db.execute(
        `UPDATE users SET full_name = ?, phone_number = ?, gender = ?, date_of_birth = ?, address = ?
         WHERE user_id = ?`,
        [full_name, phone_number, gender, date_of_birth, address, user_id]
      );

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = usersController;