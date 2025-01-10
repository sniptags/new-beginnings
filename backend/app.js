const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Use cors middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});