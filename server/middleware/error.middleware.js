const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle database constraint violations
  if (err.code === '23505') {
    return res.status(400).json({
      status: 'error',
      message: 'Resource already exists'
    });
  }

  // Handle Redis connection issues
  if (err.message && err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({
      status: 'error',
      message: 'Session service unavailable'
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = errorHandler;
