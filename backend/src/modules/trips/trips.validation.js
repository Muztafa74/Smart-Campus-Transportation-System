const { body, param, query } = require('express-validator');

const requestTripRules = [
  body('fromGateId').isMongoId().withMessage('Valid fromGateId (start) is required'),
  body('toGateId').isMongoId().withMessage('Valid toGateId (destination) is required'),
  body('carId').isMongoId().withMessage('Valid carId is required'),
];

const tripIdParam = [param('id').isMongoId().withMessage('Valid trip id is required')];
const tripIdParamV2 = [param('tripId').isMongoId().withMessage('Valid trip id is required')];

const updateStatusRules = [
  ...tripIdParam,
  body('status')
    .isIn(['IN_PROGRESS', 'COMPLETED'])
    .withMessage('status must be IN_PROGRESS or COMPLETED'),
];

const completeFromQueryRules = [
  ...tripIdParamV2,
  query('new_status').equals('COMPLETED').withMessage('new_status must be COMPLETED'),
];

module.exports = { requestTripRules, updateStatusRules, completeFromQueryRules };
