const Trip = require('../../model/trip.model');
const Car = require('../../model/car.model');
const Gate = require('../../model/gate.model');
const GatePath = require('../../model/path.model');
const User = require('../../model/user.model');

/** Lower number = higher priority when assigning cars */
const ROLE_PRIORITY = { DISABLED: 0, FACULTY: 1, ADMIN: 2 };

async function assignPendingTrips() {
  const pending = await Trip.find({ status: 'PENDING' })
    .populate('user')
    .sort({ createdAt: 1 })
    .exec();

  pending.sort((a, b) => {
    const pa = ROLE_PRIORITY[a.user.role] ?? 99;
    const pb = ROLE_PRIORITY[b.user.role] ?? 99;
    if (pa !== pb) return pa - pb;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  for (const trip of pending) {
    const car = await Car.findOne({ isAvailable: true }).sort({ createdAt: 1 });
    if (!car) break;
    trip.car = car._id;
    trip.carId = car.plateNumber;
    trip.status = 'ASSIGNED';
    car.isAvailable = false;
    await Promise.all([trip.save(), car.save()]);
  }
}

async function createTripRequest(userId, { fromGateId, toGateId, carId }) {
  if (String(fromGateId) === String(toGateId)) {
    const err = new Error('Start gate and destination gate must be different');
    err.status = 400;
    throw err;
  }
  const [fromGate, toGate] = await Promise.all([Gate.findById(fromGateId), Gate.findById(toGateId)]);
  if (!fromGate || !toGate) {
    const err = new Error('One or both gates not found');
    err.status = 404;
    throw err;
  }
  const route = await GatePath.findOne({ fromGate: fromGateId, toGate: toGateId });

  const car = await Car.findOneAndUpdate({ _id: carId, isAvailable: true }, { isAvailable: false }, { new: true });
  if (!car) {
    const exists = await Car.findById(carId);
    if (!exists) {
      const err = new Error('Vehicle not found');
      err.status = 404;
      throw err;
    }
    const err = new Error('Selected vehicle is not available. Choose another.');
    err.status = 409;
    throw err;
  }

  let trip;
  try {
    trip = await Trip.create({
      user: userId,
      fromGate: fromGateId,
      toGate: toGateId,
      carId: car.plateNumber,
      startKey: fromGate.key || null,
      destinationKey: toGate.key || null,
      digit: route?.digit ?? null,
      car: carId,
      status: 'ASSIGNED',
    });
    const who = await User.findById(userId).select('email fullName').lean();
    const userLabel = who ? `${who.fullName} <${who.email}>` : String(userId);
    // Shown in the backend terminal (where you run npm run dev / npm start)
    console.log(
      '\n[BOOKING] ROUTE DIGIT: %s | trip=%s | from=%s (%s) -> to=%s (%s) | vehicle=%s | user=%s\n',
      route?.digit ?? 'N/A',
      String(trip._id),
      fromGate.name,
      fromGate.key || '-',
      toGate.name,
      toGate.key || '-',
      car.plateNumber,
      userLabel
    );
  } catch (e) {
    await Car.findByIdAndUpdate(carId, { isAvailable: true });
    throw e;
  }

  await assignPendingTrips();
  const populated = await Trip.findById(trip._id)
    .populate('fromGate')
    .populate('toGate')
    .populate('car')
    .populate('user', '-password');
  return populated;
}

async function listMyTrips(userId) {
  return Trip.find({ user: userId }).sort({ createdAt: -1 }).populate('fromGate').populate('toGate').populate('car');
}

async function listAllTrips() {
  return Trip.find()
    .sort({ createdAt: -1 })
    .populate('fromGate')
    .populate('toGate')
    .populate('car')
    .populate('user', '-password');
}

/** PENDING → ASSIGNED is handled only by auto-assignment */
const ALLOWED_TRANSITIONS = {
  PENDING: [],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
};

async function updateTripStatus(tripId, nextStatus) {
  const trip = await Trip.findById(tripId).populate('user');
  if (!trip) {
    const err = new Error('Trip not found');
    err.status = 404;
    throw err;
  }
  const allowed = ALLOWED_TRANSITIONS[trip.status] || [];
  if (!allowed.includes(nextStatus)) {
    const err = new Error(`Cannot move trip from ${trip.status} to ${nextStatus}`);
    err.status = 400;
    throw err;
  }
  trip.status = nextStatus;
  if (nextStatus === 'COMPLETED' && trip.car) {
    await Car.findByIdAndUpdate(trip.car, { isAvailable: true });
    await assignPendingTrips();
  }
  await trip.save();
  return Trip.findById(trip._id)
    .populate('fromGate')
    .populate('toGate')
    .populate('car')
    .populate('user', '-password');
}

async function completeTripById(tripId) {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    const err = new Error('Trip not found');
    err.status = 404;
    throw err;
  }

  if (trip.status === 'COMPLETED') {
    return { alreadyCompleted: true, trip: await Trip.findById(trip._id).populate('fromGate').populate('toGate').populate('car') };
  }

  trip.status = 'COMPLETED';

  let car = null;
  if (trip.carId) {
    car = await Car.findOne({ plateNumber: trip.carId });
  }
  if (!car && trip.car) {
    car = await Car.findById(trip.car);
  }

  if (car) {
    car.isAvailable = true;
    await car.save();
    console.log(`Car ${car.plateNumber} is now AVAILABLE`);
  }

  await trip.save();
  console.log(`Trip ${tripId} marked as COMPLETED`);

  const updatedTrip = await Trip.findById(trip._id).populate('fromGate').populate('toGate').populate('car').populate('user', '-password');
  return { alreadyCompleted: false, trip: updatedTrip };
}

module.exports = {
  assignPendingTrips,
  createTripRequest,
  listMyTrips,
  listAllTrips,
  updateTripStatus,
  completeTripById,
};
