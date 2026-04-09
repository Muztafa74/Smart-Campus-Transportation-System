const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../model/user.model');
const env = require('../../../config/env.service');

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function toPublicUser(userDoc) {
  return {
    id: userDoc._id,
    email: userDoc.email,
    fullName: userDoc.fullName,
    role: userDoc.role,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
}

async function register({ email, password, full_name, role }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: normalizedEmail,
    password: hashed,
    fullName: full_name,
    role,
  });
  const token = signToken(user._id);
  return { user: toPublicUser(user), token };
}

async function login({ email, password }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  user.password = undefined;
  const token = signToken(user._id);
  return { user: toPublicUser(user), token };
}

module.exports = { register, login, signToken, toPublicUser };
