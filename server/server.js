const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutesV1 = require('./routes/v1/auth.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

// versioned API mount
app.use('/api/v1/auth', authRoutesV1);

module.exports = app;
