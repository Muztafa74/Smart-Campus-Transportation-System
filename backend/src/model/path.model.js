const mongoose = require('mongoose');

/** Directed path between two gates; `digit` is an admin-defined numeric code (e.g. distance, minutes, route id). */
const gatePathSchema = new mongoose.Schema(
  {
    fromGate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
    toGate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', required: true },
    digit: { type: Number, required: true },
  },
  { timestamps: true }
);

gatePathSchema.index({ fromGate: 1, toGate: 1 }, { unique: true });

module.exports = mongoose.model('GatePath', gatePathSchema);
