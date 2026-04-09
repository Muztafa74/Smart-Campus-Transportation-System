const Gate = require('../../model/gate.model');

async function listPublic(req, res, next) {
  try {
    const gates = await Gate.find().sort({ name: 1 });
    res.json({ gates });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const { name, key, description } = req.body;
    const gate = await Gate.create({ name, key, description: description ?? '' });
    res.status(201).json({ gate });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'Gate name or key already exists';
    }
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { name, key, description } = req.body;
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ message: 'Gate not found' });
    }
    if (name !== undefined) gate.name = name;
    if (key !== undefined) gate.key = key;
    if (description !== undefined) gate.description = description;
    await gate.save();
    res.json({ gate });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'Gate name or key already exists';
    }
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const gate = await Gate.findByIdAndDelete(req.params.id);
    if (!gate) {
      return res.status(404).json({ message: 'Gate not found' });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { listPublic, create, update, remove };
