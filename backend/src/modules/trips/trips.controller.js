const tripsService = require('./trips.service');

function gateLabel(g) {
  if (!g) return null;
  if (typeof g === 'string') return g;
  const name = g.name || '';
  const key = g.key || '';
  if (name && key) return `${name} (${key})`;
  return name || key || String(g._id || '');
}

function serializeTrip(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  const fromGate = o.fromGate || o.gate;
  const toGate = o.toGate || o.gate;
  return {
    id: o._id,
    status: o.status,
    // legacy `gate` only: treat as both ends until migrated
    fromGate,
    toGate,
    fromGateLabel: gateLabel(fromGate),
    toGateLabel: gateLabel(toGate),
    startKey: o.startKey ?? o.sourceKey ?? fromGate?.key ?? null,
    destinationKey: o.destinationKey ?? toGate?.key ?? null,
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

async function patchStatusByQuery(req, res, next) {
  try {
    const { tripId } = req.params;
    const { new_status: newStatus } = req.query;

    if (newStatus === 'COMPLETED') {
      const result = await tripsService.completeTripById(tripId);
      if (result.alreadyCompleted) {
        return res.json({ message: 'Trip already completed', trip: serializeTrip(result.trip) });
      }
      return res.json({ trip: serializeTrip(result.trip) });
    }

    if (!req.body?.status) {
      return res.status(400).json({ message: 'Provide ?new_status=COMPLETED or body.status' });
    }
    const trip = await tripsService.updateTripStatus(tripId, req.body.status);
    return res.json({ trip: serializeTrip(trip) });
  } catch (e) {
    next(e);
  }
}

module.exports = { requestTrip, myTrips, allTrips, patchStatus, patchStatusByQuery };
