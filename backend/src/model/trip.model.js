const mongoose = require('mongoose');

const TRIP_STATUSES = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    /** Pickup / start gate */
    fromGate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
    /** Destination gate */
    toGate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
    /** External car identifier for integration clients (string), e.g. CAR_1 */
    carId: { type: String, default: null, trim: true },
    /** Snapshot of start gate key at booking time */
    startKey: { type: String, default: null },
    /** Snapshot of destination gate key at booking time */
    destinationKey: { type: String, default: null },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', default: null },
    /** Copied from GatePath when the trip is created (route digit for this start → destination) */
    digit: { type: Number, default: null },
    status: {
      type: String,
      enum: TRIP_STATUSES,
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
module.exports.TRIP_STATUSES = TRIP_STATUSES;
