const mongoose = require('mongoose');
const env = require('../../config/env.service');

async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
}

module.exports = { connectDatabase };
