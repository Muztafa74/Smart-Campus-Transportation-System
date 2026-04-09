const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    plateNumber: { type: String, required: true, unique: true, trim: true },
    model: { type: String, default: '', trim: true },
    seats: { type: Number, default: 4, min: 1 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
