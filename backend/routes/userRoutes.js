const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to log mood
router.post('/logMood', userController.logMood);

// Route to get historical data
router.get('/historicalData', userController.getUserEntries);

// Route to get recommendations
router.get('/recommendations', userController.getRecommendations);

// Route to login
router.post('/login', userController.login);

module.exports = router;