/**
 * Create a custom error object
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @returns {Error} - Custom error object
 */
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export default createError;
