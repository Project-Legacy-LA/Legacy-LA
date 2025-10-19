const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutesV1 = require('./routes/v1/auth.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// versioned API mount
app.use('/api/v1/auth', authRoutesV1);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
