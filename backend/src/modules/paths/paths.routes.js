const { Router } = require('express');
const { body, param } = require('express-validator');
const pathsController = require('./paths.controller');
const { authMiddleware, requireRoles } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../utils/validation');

const r = Router();

const idParam = [param('id').isMongoId().withMessage('Valid path id is required')];

const createRules = [
  body('fromGateId').isMongoId().withMessage('fromGateId required'),
  body('toGateId').isMongoId().withMessage('toGateId required'),
  body('digit').isInt({ min: 0 }).withMessage('digit must be a non-negative integer'),
];

const updateRules = [
  ...idParam,
  body('fromGateId').optional().isMongoId(),
  body('toGateId').optional().isMongoId(),
  body('digit').optional().isInt({ min: 0 }),
];

r.use(authMiddleware, requireRoles('ADMIN'));

r.get('/', pathsController.list);
r.post('/', createRules, validateRequest, pathsController.create);
r.patch('/:id', updateRules, validateRequest, pathsController.update);
r.delete('/:id', idParam, validateRequest, pathsController.remove);

module.exports = r;
