const Car = require('../../model/car.model');

async function list(req, res, next) {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json({ cars });
  } catch (e) {
    next(e);
  }
}

/** Any logged-in user: vehicles free to book */
async function listAvailable(req, res, next) {
  try {
    const cars = await Car.find({ isAvailable: true }).sort({ plateNumber: 1 });
    res.json({ cars });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const { plateNumber, model, seats, isAvailable } = req.body;
    const car = await Car.create({
      plateNumber,
      model: model ?? '',
      seats: seats ?? 4,
      isAvailable: isAvailable ?? true,
    });
    res.status(201).json({ car });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'Plate number already exists';
    }
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { plateNumber, model, seats, isAvailable } = req.body;
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (plateNumber !== undefined) car.plateNumber = plateNumber;
    if (model !== undefined) car.model = model;
    if (seats !== undefined) car.seats = seats;
    if (isAvailable !== undefined) car.isAvailable = isAvailable;
    await car.save();
    res.json({ car });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'Plate number already exists';
    }
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { list, listAvailable, create, update, remove };
