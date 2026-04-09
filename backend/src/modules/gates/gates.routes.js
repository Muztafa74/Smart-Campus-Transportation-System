const { Router } = require('express');
const { body, param } = require('express-validator');
const gatesController = require('./gates.controller');
const { authMiddleware, requireRoles } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../utils/validation');

const r = Router();

const idParam = [param('id').isMongoId().withMessage('Valid gate id is required')];

const createRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('key').trim().notEmpty().withMessage('key is required').isLength({ min: 2, max: 20 }),
  body('description').optional().trim(),
];

const updateRules = [
  ...idParam,
  body('name').optional().trim().notEmpty(),
  body('key').optional().trim().notEmpty().isLength({ min: 2, max: 20 }),
  body('description').optional().trim(),
];

r.get('/', authMiddleware, gatesController.listPublic);

r.post('/', authMiddleware, requireRoles('ADMIN'), createRules, validateRequest, gatesController.create);
r.patch(
  '/:id',
  authMiddleware,
  requireRoles('ADMIN'),
  updateRules,
  validateRequest,
  gatesController.update
);
r.delete('/:id', authMiddleware, requireRoles('ADMIN'), idParam, validateRequest, gatesController.remove);

module.exports = r;
