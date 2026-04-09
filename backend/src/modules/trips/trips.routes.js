const { Router } = require('express');
const tripsController = require('./trips.controller');
const { authMiddleware, requireRoles } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../utils/validation');
const { requestTripRules, updateStatusRules } = require('./trips.validation');

const r = Router();

r.post('/request', authMiddleware, requestTripRules, validateRequest, tripsController.requestTrip);
r.get('/my', authMiddleware, tripsController.myTrips);

r.get('/', authMiddleware, requireRoles('ADMIN'), tripsController.allTrips);
r.patch(
  '/:id/status',
  authMiddleware,
  requireRoles('ADMIN'),
  updateStatusRules,
  validateRequest,
  tripsController.patchStatus
);

module.exports = r;
