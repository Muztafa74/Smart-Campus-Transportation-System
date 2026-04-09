const mongoose = require('mongoose');

/**
 * Production User (auth, roles, bcrypt password).
 * For a minimal schema sample see `exampleUser.model.js`.
 */
const ROLES = ['FACULTY', 'DISABLED', 'ADMIN'];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ROLES, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
