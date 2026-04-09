const Trip = require('../../model/trip.model');
async function getNextAssignedTripForCar(carId) {
  console.log(`Car ${carId} requesting trip`);

  // Atomic claim by external string carId (e.g. CAR_1 / plate value)
  const claimedTrip = await Trip.findOneAndUpdate(
    { carId, status: 'ASSIGNED' },
    { status: 'IN_PROGRESS' },
    { sort: { createdAt: 1 }, new: true }
  );

  if (!claimedTrip) {
    return null;
  }

  console.log('Trip assigned:', claimedTrip._id);

  const trip = await Trip.findById(claimedTrip._id).populate('fromGate', 'key').populate('toGate', 'key').lean();
  const sourceRaw = trip?.startKey ?? trip?.fromGate?.key;
  const destinationRaw = trip?.destinationKey ?? trip?.toGate?.key;
  const source = Number(sourceRaw);
  const destination = Number(destinationRaw);

  if (!Number.isFinite(source) || !Number.isFinite(destination)) {
    const err = new Error('Gate keys must be numeric');
    err.status = 400;
    err.code = 'GATE_KEYS_NOT_NUMERIC';
    // rollback claim so trip remains available for processing
    await Trip.findByIdAndUpdate(claimedTrip._id, { status: 'ASSIGNED' });
    throw err;
  }

  return {
    trip_id: String(claimedTrip._id),
    source,
    destination,
  };
}

module.exports = {
  getNextAssignedTripForCar,
};

