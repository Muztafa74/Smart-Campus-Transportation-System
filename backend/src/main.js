const express = require('express');
const cors = require('cors');
const env = require('../config/env.service');
const { connectDatabase } = require('./database/connection');
const authRoutes = require('./modules/auth/auth.routes');
const usersRoutes = require('./modules/users/users.routes');
const tripsRoutes = require('./modules/trips/trips.routes');
const carsRoutes = require('./modules/cars/cars.routes');
const gatesRoutes = require('./modules/gates/gates.routes');
const pathsRoutes = require('./modules/paths/paths.routes');
const { setupSwagger } = require('./swagger/swagger.setup');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

setupSwagger(app, env.port);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/gates', gatesRoutes);
app.use('/api/paths', pathsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ message });
});

async function start() {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
    console.log(`Swagger UI: http://localhost:${env.port}/api-docs`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
