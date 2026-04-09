const { Router } = require('express');
const { body, param } = require('express-validator');
const carsController = require('./cars.controller');
const { authMiddleware, requireRoles } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../utils/validation');

const r = Router();

r.get('/available', authMiddleware, carsController.listAvailable);

const idParam = [param('id').isMongoId().withMessage('Valid car id is required')];

const createRules = [
  body('plateNumber').trim().notEmpty().withMessage('plateNumber is required'),
  body('model').optional().trim(),
  body('seats').optional().isInt({ min: 1 }),
  body('isAvailable').optional().isBoolean(),
];

const updateRules = [
  ...idParam,
  body('plateNumber').optional().trim().notEmpty(),
  body('model').optional().trim(),
  body('seats').optional().isInt({ min: 1 }),
  body('isAvailable').optional().isBoolean(),
];

r.get('/', authMiddleware, requireRoles('ADMIN'), carsController.list);
r.post('/', authMiddleware, requireRoles('ADMIN'), createRules, validateRequest, carsController.create);
r.patch(
  '/:id',
  authMiddleware,
  requireRoles('ADMIN'),
  updateRules,
  validateRequest,
  carsController.update
);
r.delete('/:id', authMiddleware, requireRoles('ADMIN'), idParam, validateRequest, carsController.remove);

module.exports = r;
