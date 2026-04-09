const GatePath = require('../../model/path.model');
const Gate = require('../../model/gate.model');

function serializePath(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id,
    fromGate: o.fromGate,
    toGate: o.toGate,
    digit: o.digit,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

async function list(req, res, next) {
  try {
    const paths = await GatePath.find().sort({ createdAt: -1 }).populate('fromGate').populate('toGate');
    res.json({ paths: paths.map(serializePath) });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const { fromGateId, toGateId, digit } = req.body;
    if (String(fromGateId) === String(toGateId)) {
      return res.status(400).json({ message: 'From and to gate must be different' });
    }
    const [from, to] = await Promise.all([Gate.findById(fromGateId), Gate.findById(toGateId)]);
    if (!from || !to) {
      return res.status(404).json({ message: 'One or both gates not found' });
    }
    const row = await GatePath.create({
      fromGate: fromGateId,
      toGate: toGateId,
      digit,
    });
    const populated = await GatePath.findById(row._id).populate('fromGate').populate('toGate');
    res.status(201).json({ path: serializePath(populated) });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'A path between these gates already exists';
    }
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { fromGateId, toGateId, digit } = req.body;
    const row = await GatePath.findById(req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Path not found' });
    }
    if (fromGateId !== undefined || toGateId !== undefined) {
      const from = fromGateId ?? row.fromGate;
      const to = toGateId ?? row.toGate;
      if (String(from) === String(to)) {
        return res.status(400).json({ message: 'From and to gate must be different' });
      }
      const [gFrom, gTo] = await Promise.all([Gate.findById(from), Gate.findById(to)]);
      if (!gFrom || !gTo) {
        return res.status(404).json({ message: 'One or both gates not found' });
      }
      row.fromGate = from;
      row.toGate = to;
    }
    if (digit !== undefined) row.digit = digit;
    await row.save();
    const populated = await GatePath.findById(row._id).populate('fromGate').populate('toGate');
    res.json({ path: serializePath(populated) });
  } catch (e) {
    if (e.code === 11000) {
      e.status = 409;
      e.message = 'A path between these gates already exists';
    }
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const row = await GatePath.findByIdAndDelete(req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Path not found' });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { list, create, update, remove };
