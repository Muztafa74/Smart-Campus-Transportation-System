const express = require('express');
const env = require('../config/env.service');
const { createCorsMiddleware } = require('../config/cors');
const { connectDatabase, disconnectDatabase } = require('../config/db');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const tripsRoutes = require('./modules/trips/trips.routes');
const carsRoutes = require('./modules/cars/cars.routes');
const carClientRoutes = require('./modules/cars/car-client.routes');
const gatesRoutes = require('./modules/gates/gates.routes');
const pathsRoutes = require('./modules/paths/paths.routes');
const testRoutes = require('./routes/test.routes');
const { setupSwagger } = require('./swagger/swagger.setup');

const app = express();

if (env.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(createCorsMiddleware(env));
app.use(express.json({ limit: '256kb' }));

setupSwagger(app, env);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/test', testRoutes);
app.use('/test', testRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/car', carClientRoutes);
app.use('/api/gates', gatesRoutes);
app.use('/api/paths', pathsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found', path: req.path });
});

app.use(errorHandler);

async function start() {
  await connectDatabase();

  const server = app.listen(env.port, env.host, () => {
    const base = env.apiPublicUrl || `http://127.0.0.1:${env.port}`;
    console.log(`API listening on http://${env.host}:${env.port}`);
    console.log(`Health: GET ${base}/api/health`);
    console.log(`Swagger UI: ${base}/api-docs`);
  });

  async function shutdown(signal) {
    console.info(`\n${signal}: shutting down…`);
    server.close(async () => {
      try {
        await disconnectDatabase();
      } catch (e) {
        console.error('[db] Error while disconnecting:', e.message);
      }
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 15_000).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((e) => {
  console.error('[server] Startup aborted:', e.message);
  process.exit(1);
});
