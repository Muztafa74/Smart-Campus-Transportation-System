const tripsService = require('./trips.service');

function serializeTrip(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id,
    status: o.status,
    // legacy `gate` only: treat as both ends until migrated
    fromGate: o.fromGate || o.gate,
    toGate: o.toGate || o.gate,
    digit: o.digit ?? null,
    car: o.car,
    user: o.user,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

async function requestTrip(req, res, next) {
  try {
    const trip = await tripsService.createTripRequest(req.user._id, {
      fromGateId: req.body.fromGateId,
      toGateId: req.body.toGateId,
      carId: req.body.carId,
    });
    res.status(201).json({ trip: serializeTrip(trip) });
  } catch (e) {
    next(e);
  }
}

async function myTrips(req, res, next) {
  try {
    const trips = await tripsService.listMyTrips(req.user._id);
    res.json({ trips: trips.map(serializeTrip) });
  } catch (e) {
    next(e);
  }
}

async function allTrips(req, res, next) {
  try {
    const trips = await tripsService.listAllTrips();
    res.json({ trips: trips.map(serializeTrip) });
  } catch (e) {
    next(e);
  }
}

async function patchStatus(req, res, next) {
  try {
    const trip = await tripsService.updateTripStatus(req.params.id, req.body.status);
    res.json({ trip: serializeTrip(trip) });
  } catch (e) {
    next(e);
  }
}

module.exports = { requestTrip, myTrips, allTrips, patchStatus };
