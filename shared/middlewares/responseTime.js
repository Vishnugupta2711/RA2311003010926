const { Log } = require('../../logging_middleware/logger');

const responseTimeLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 500) {
      Log('backend', 'warn', 'route', `${req.method} ${req.originalUrl} took ${duration}ms (Slow)`);
    }
  });

  next();
};

module.exports = responseTimeLogger;
