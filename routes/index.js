const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Hello from API!' });
});

module.exports = router;
// This is the main entry point for the API routes.
// It defines a simple route that responds with a JSON message.