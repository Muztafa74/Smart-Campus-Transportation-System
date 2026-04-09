const mongoose = require('mongoose');

const TRIP_STATUSES = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    /** Pickup / start gate */
    fromGate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
    /** Destination gate */
    toGate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
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
