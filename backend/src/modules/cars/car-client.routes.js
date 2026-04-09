const { Router } = require('express');
const { param } = require('express-validator');
const carsController = require('./cars.controller');
const { validateRequest } = require('../../utils/validation');

const r = Router();

r.get(
  '/:carId/next-trip',
  [param('carId').trim().notEmpty().withMessage('carId is required')],
  validateRequest,
  carsController.nextTrip
);

module.exports = r;

