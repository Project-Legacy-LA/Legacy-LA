const express = require('express');
const cors = require('cors');
const pool = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Legacy LA API' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 'error',
        message: 'Something went wrong!' 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
