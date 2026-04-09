/**
 * Optional: creates an ADMIN user, sample gates, and cars for local testing.
 * Usage: node scripts/seed-demo.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../config/.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../src/model/user.model');
const Gate = require('../src/model/gate.model');
const Car = require('../src/model/car.model');
const GatePath = require('../src/model/path.model');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI missing in config/.env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri);
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@campus.local').toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
  const resetPwd = ['1', 'true', 'yes'].includes(
    String(process.env.SEED_RESET_ADMIN_PASSWORD || '').toLowerCase()
  );

  let admin = await User.findOne({ email });
  const hashed = await bcrypt.hash(password, 10);

  if (!admin) {
    admin = await User.create({
      email,
      password: hashed,
      fullName: 'Campus Admin',
      role: 'ADMIN',
    });
    console.log('Created ADMIN:', email, '| password:', password);
  } else if (resetPwd) {
    admin.password = hashed;
    await admin.save();
    console.log('Reset ADMIN password for:', email, '| new password:', password);
  } else {
    console.log('ADMIN already exists:', email, '(password not changed)');
    console.log('  If login fails, run: SEED_RESET_ADMIN_PASSWORD=1 npm run seed');
    console.log('  Default password when seeded fresh:', password);
  }

  const gates = [
    { name: 'Main Gate', description: 'North entrance' },
    { name: 'Library Gate', description: 'Near library' },
  ];
  for (const g of gates) {
    const exists = await Gate.findOne({ name: g.name });
    if (!exists) await Gate.create(g);
  }
  console.log('Gates ensured:', gates.map((g) => g.name).join(', '));

  const cars = [
    { plateNumber: 'CAMP-001', model: 'Shuttle A', seats: 8 },
    { plateNumber: 'CAMP-002', model: 'Shuttle B', seats: 8 },
  ];
  for (const c of cars) {
    const exists = await Car.findOne({ plateNumber: c.plateNumber });
    if (!exists) await Car.create({ ...c, isAvailable: true });
  }
  console.log('Cars ensured:', cars.map((c) => c.plateNumber).join(', '));

  const gMain = await Gate.findOne({ name: 'Main Gate' });
  const gLib = await Gate.findOne({ name: 'Library Gate' });
  if (gMain && gLib) {
    const hasPath = await GatePath.findOne({ fromGate: gMain._id, toGate: gLib._id });
    if (!hasPath) {
      await GatePath.create({ fromGate: gMain._id, toGate: gLib._id, digit: 15 });
      console.log('Sample path: Main Gate → Library Gate (digit 15)');
    }
  }

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
