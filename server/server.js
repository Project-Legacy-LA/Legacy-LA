const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const authRoutes = require('./routes/v1/auth');
const tenantRoutes = require('./routes/v1/tenant');
const clientRoutes = require('./routes/v1/client');
const usersRoutes = require('./routes/v1/superUser');
const profileRoutes = require('./routes/v1/profile');
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsConfig = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

app.use(express.json());
app.use(cookieParser());

// Versioned API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenant', tenantRoutes);
app.use('/api/v1/client', clientRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/profile', profileRoutes);
// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
