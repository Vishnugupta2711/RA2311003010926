const { Log } = require('../../logging_middleware/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  Log('backend', 'error', 'handler', `${err.message} - ${req.originalUrl}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
