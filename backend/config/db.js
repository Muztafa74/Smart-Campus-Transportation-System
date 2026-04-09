const mongoose = require('mongoose');
const env = require('./env.service');

/** Options tuned for MongoDB Atlas and long-lived API processes */
const MONGOOSE_OPTIONS = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
};

let listenersAttached = false;

function attachConnectionListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('error', (err) => {
    console.error('[db] Mongoose runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] Mongoose disconnected from cluster');
  });
}

/**
 * Connect to MongoDB (Atlas or self-hosted). Call once before `app.listen`.
 * @returns {Promise<void>}
 */
async function connectDatabase() {
  attachConnectionListeners();

  if (mongoose.connection.readyState === 1) {
    console.info('[db] Reusing existing Mongoose connection');
    return;
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongoUri, MONGOOSE_OPTIONS);
    const { host, name } = mongoose.connection;
    console.info(`[db] Connected to MongoDB (db: "${name}", host: ${host})`);
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    throw err;
  }
}

/**
 * Graceful shutdown helper
 * @returns {Promise<void>}
 */
async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  console.info('[db] Mongoose connection closed');
}

module.exports = { connectDatabase, disconnectDatabase };
