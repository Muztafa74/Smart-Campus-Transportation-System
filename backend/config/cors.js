const cors = require('cors');

/**
 * CORS for browser clients (e.g. Vercel SPA). Uses CORS_ORIGINS allowlist in production.
 */
function parseOriginList(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isVercelAppOrigin(origin) {
  try {
    const u = new URL(origin);
    return u.protocol === 'https:' && u.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

function createCorsMiddleware(env) {
  const allowlist = parseOriginList(env.corsOrigins);

  return cors({
    origin(origin, callback) {
      // Same-origin / server-side / curl (no Origin header)
      if (!origin) {
        return callback(null, true);
      }

      // Explicit allowlist
      if (allowlist.includes(origin)) {
        return callback(null, true);
      }

      // Preview deployments: *.vercel.app
      if (env.corsAllowVercelPreviews && isVercelAppOrigin(origin)) {
        return callback(null, true);
      }

      // Local development: permissive when no allowlist (DX)
      if (env.nodeEnv !== 'production') {
        if (allowlist.length === 0) {
          return callback(null, true);
        }
        console.warn('[cors] Blocked origin (dev):', origin);
        return callback(null, false);
      }

      // Production: no match
      if (allowlist.length > 0 || env.corsAllowVercelPreviews) {
        console.warn('[cors] Blocked origin:', origin);
        return callback(null, false);
      }

      // Production fallback if env not yet configured (log loudly)
      console.warn(
        '[cors] CORS_ORIGINS not set — allowing any origin. Set CORS_ORIGINS for production security.'
      );
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [],
    maxAge: 86_400,
  });
}

module.exports = { createCorsMiddleware, parseOriginList };
