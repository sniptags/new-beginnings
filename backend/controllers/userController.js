const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const OpenAI = require("openai");
const dataPath = path.join(__dirname, '../data.json');
const secretKey = 'my_secret_key'; // Replace with a secure key
require('dotenv').config()


// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Invalid token format' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.username = decoded.username;
        next();
    });
};

// Log mood, reason, and productivity
exports.logMood = [authenticate, (req, res) => {
    const { mood, reason, productivity } = req.body;
    const username = req.username;

    if (!mood || !reason || productivity === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    User.getUserData(username).then(user => {
        user = new User(username, user.password, user.moodLogs);
        user.logMood(mood, reason, productivity);
        res.status(201).json({ message: 'Entry logged successfully' });
    }).catch(err => res.status(500).json({ message: err }));
}];

// Get historical data for a user
exports.getUserEntries = [authenticate, (req, res) => {
    const username = req.username;

    User.getUserData(username).then(user => {
        if (!user) {
            return res.status(404).json({ message: 'No entries found for this user' });
        }

        res.status(200).json(user.moodLogs);
    }).catch(err => res.status(500).json({ message: err }));
}];

// Get recommendations based on user's entries
exports.getRecommendations = [authenticate, (req, res) => {
    const username = req.username;

    User.getUserData(username).then(async(user) => {
        if (!user) {
            return res.status(404).json({ message: 'No entries found for this user' });
        }

        const userEntries = user.moodLogs;
        const prompt = `Based on the following mood and productivity logs, provide 2 personalized recommendations. Response should only include recommendation and details in plain text :\n${JSON.stringify(userEntries)}`;
        const client = new OpenAI({
            baseURL: "https://models.inference.ai.azure.com",
            apiKey: process.env.OPENAI_API_KEY
          });
          
          try{
          const response = await client.chat.completions.create({
            messages: [
              { role:"system", content: "" },
              { role:"user", content: prompt }
            ],
            model: "gpt-4o",
            temperature: 1,
            max_tokens: 150,
            top_p: 1
          });
            const recommendations = response.choices[0].message.content;

            res.status(200).json({ recommendations });
        }catch(err){console.log(err) //res.status(500).json({ message: 'Failed to get recommendations', error: err.message })
        };
    }).catch(err => res.status(500).json({ message: err }));
}];

// User login or signup
exports.login = (req, res) => {
    const { username, password } = req.body;

    User.authenticate(username, password).then(token => {
        res.status(200).json({ token });
    }).catch(err => {
        // If authentication fails, sign up the user
        if (err === 'User not found') {
            const newUser = new User(username, password);
            newUser.save().then(() => {
                const token = jwt.sign({ username }, secretKey, { expiresIn: '24h' });
                res.status(201).json({ token });
            }).catch(saveErr => res.status(500).json({ message: saveErr }));
        } else {
            res.status(401).json({ message: err });
        }
    });
};