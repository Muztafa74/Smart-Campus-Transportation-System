const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/user.model');
const ExampleUser = require('../model/exampleUser.model');

const router = express.Router();

/**
 * Health check that verifies MongoDB responds (ping + optional model counts).
 */
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ok: false,
        message: 'Database not connected',
        readyState: mongoose.connection.readyState,
      });
    }

    await mongoose.connection.db.admin().command({ ping: 1 });

    const [users, exampleUsers] = await Promise.all([
      User.countDocuments(),
      ExampleUser.countDocuments(),
    ]);

    res.json({
      ok: true,
      message: 'Database connection OK',
      mongo: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      counts: {
        users,
        exampleUsers,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
