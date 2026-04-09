const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

function required(name) {
  const v = process.env[name];
  if (v === undefined || v === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  /** development | production | test */
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  /** Comma-separated browser origins, e.g. https://myapp.vercel.app */
  corsOrigins: process.env.CORS_ORIGINS || '',
  /** Allow any https://*.vercel.app (preview URLs) */
  corsAllowVercelPreviews: ['1', 'true', 'yes'].includes(
    String(process.env.CORS_ALLOW_VERCEL_PREVIEWS || '').toLowerCase()
  ),
  /**
   * Public origin for Swagger + logs (no path or trailing slash).
   * Example: https://your-api.onrender.com — OpenAPI paths already include /api/...
   * If you paste .../api by mistake, it is stripped.
   */
  apiPublicUrl: (() => {
    let u = String(process.env.API_PUBLIC_URL || '').trim().replace(/\/$/, '');
    if (u.endsWith('/api')) u = u.slice(0, -4).replace(/\/$/, '');
    return u;
  })(),
  /** Trust X-Forwarded-* when behind Render / Railway / nginx (default true; set TRUST_PROXY=false to disable) */
  trustProxy: String(process.env.TRUST_PROXY || 'true').toLowerCase() !== 'false',
  /** Bind address (0.0.0.0 for containers and most PaaS) */
  host: process.env.HOST || '0.0.0.0',
};
