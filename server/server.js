const express = require('express');
const cookieParser = require('cookie-parser');

// Route imports
const authRoutes = require('./routes/v1/auth');
const tenantRoutes = require('./routes/v1/tenant');
const clientRoutes = require('./routes/v1/client');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Versioned API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenant', tenantRoutes);
app.use('/api/v1/client', clientRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
