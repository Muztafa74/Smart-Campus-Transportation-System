const { body } = require('express-validator');
const { ROLES } = require('../../model/user.model');

const registerRoles = ROLES.filter((r) => r !== 'ADMIN');

const registerRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('role')
    .isIn(registerRoles)
    .withMessage(`Role must be one of: ${registerRoles.join(', ')}`),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerRules, loginRules };
