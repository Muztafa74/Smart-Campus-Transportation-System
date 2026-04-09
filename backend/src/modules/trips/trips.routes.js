const { Router } = require('express');
const { param } = require('express-validator');
const tripsController = require('./trips.controller');
const { authMiddleware, requireRoles } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../utils/validation');
const { requestTripRules } = require('./trips.validation');

const r = Router();

r.post('/request', authMiddleware, requestTripRules, validateRequest, tripsController.requestTrip);
r.get('/my', authMiddleware, tripsController.myTrips);

const tripIdParam = [param('tripId').isMongoId().withMessage('Valid trip id is required')];
const maybeAdminAuth = (req, res, next) => {
  // Car system flow: PATCH /api/trips/:tripId/status?new_status=COMPLETED
  if (req.query.new_status === 'COMPLETED') return next();
  // Otherwise keep admin-protected status update behavior
  return authMiddleware(req, res, () => requireRoles('ADMIN')(req, res, next));
};

r.patch('/:tripId/status', tripIdParam, validateRequest, maybeAdminAuth, tripsController.patchStatusByQuery);

r.get('/', authMiddleware, requireRoles('ADMIN'), tripsController.allTrips);

module.exports = r;
