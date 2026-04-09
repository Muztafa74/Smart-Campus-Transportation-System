const env = require('../../config/env.service');

/**
 * Consistent JSON errors for the SPA and monitoring.
 * Does not leak stack traces or internal details in production for 5xx.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isProd = env.nodeEnv === 'production';

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id format' });
  }

  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.entries(err.errors).map(([field, e]) => ({
      field,
      message: e.message,
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
    return res.status(409).json({
      message: 'Duplicate entry',
      ...(field ? { field } : {}),
    });
  }

  const status = Number(err.status || err.statusCode) || 500;
  let message = err.message || 'Internal server error';

  if (status >= 500) {
    console.error('[error]', err);
    if (isProd) {
      message = 'Internal server error';
    }
  }

  res.status(status).json({ message });
}

module.exports = { errorHandler };
