/**
 * Success response
 * @param {Object} res - Express response object
 * @param {Object} data - payload (default = empty object)
 * @param {string} message - message string
 * @param {number} status - HTTP status code (default = 200)
 */
function success(res, data = {}, message = 'OK', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - error message
 * @param {number} status - HTTP status code (default = 400)
 */
function error(res, message = 'Error', status = 400) {
  return res.status(status).json({
    success: false,
    message,
  });
}

module.exports = {
  success,
  error,
};
