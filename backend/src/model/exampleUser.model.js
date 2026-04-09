const mongoose = require('mongoose');

/**
 * Minimal example schema (separate collection) for demos and /test diagnostics.
 * Application auth uses `user.model.js` (roles, password, etc.).
 */
const exampleUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true, collection: 'example_users' }
);

module.exports = mongoose.model('ExampleUser', exampleUserSchema);
