const { body } = require('express-validator');
const { ROLES } = require('../../model/user.model');

const registerRoles = ROLES.filter((r) => r !== 'ADMIN');

const horusEmailMsg = 'Email must be a Horus University address (@horus.edu.eg)';

const registerRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .custom((value) => {
      const e = String(value || '').toLowerCase();
      if (!e.endsWith('@horus.edu.eg')) {
        throw new Error(horusEmailMsg);
      }
      return true;
    }),
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
