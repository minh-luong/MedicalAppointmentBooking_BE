const db = require('../db');
const crypto = require('crypto');

const authController = {
    // generate token with length 64
    generateToken: async (firebase_uid) => {
        try {
            let token = crypto.randomBytes(32).toString('hex');
            // get user_id from firebase_uid
            if(firebase_uid) {
                const [user] = await db.query(`SELECT user_id FROM users WHERE firebase_uid = ?`, [firebase_uid]);
                if(user.length === 0) return null;
                const user_id = user[0].user_id;
                const [result] = await db.query(`INSERT INTO login_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`, [user_id, token]);
                return token;
            }
            else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    // get token via firebase_uid
    getToken: async (req, res) => {
        const firebase_uid = req.body.uid;
        try {
            const [result] = await db.query(`SELECT token FROM login_tokens JOIN users ON login_tokens.user_id = users.user_id 
                WHERE firebase_uid = ? AND expires_at > NOW()`, [firebase_uid]);
            
            if(result.length === 0)
                return res.status(200).json({ token: await authController.generateToken(firebase_uid) });
            else
                return res.status(200).json({ token: result[0].token });
        } 
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    validateToken: async (req) => {
        const token = req.headers['authorization'];
        const { user_id , uid} = req.body;
        if (!token) {
            return false;
        }

        console.error("Validating token:", token, "for user_id:", user_id, "or uid:", uid);
        try {
            let check = [];
            if(user_id) {
                [check] = await db.query('SELECT COUNT(*) FROM login_tokens WHERE user_id = ? AND token = ? AND expires_at > NOW()', [user_id, token]);
            }
            else if(uid) {
                [check] = await db.query('SELECT COUNT(*) FROM users JOIN login_tokens ON users.user_id = login_tokens.user_id WHERE firebase_uid = ? AND token = ? AND expires_at > NOW()', [uid, token]);
            }
            else
                return false;

            console.error("Token validation result:", check[0]);
            if (check[0] === 0) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
};

module.exports = authController;