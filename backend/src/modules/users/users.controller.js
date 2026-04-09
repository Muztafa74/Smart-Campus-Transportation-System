const User = require('../../model/user.model');
const authService = require('../auth/auth.service');

async function me(req, res, next) {
  try {
    res.json({ user: authService.toPublicUser(req.user) });
  } catch (e) {
    next(e);
  }
}

async function list(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json({ users: users.map((u) => authService.toPublicUser(u)) });
  } catch (e) {
    next(e);
  }
}

async function updateUser(req, res, next) {
  try {
    const { fullName, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (fullName !== undefined) user.fullName = fullName;
    if (role !== undefined) {
      if (!['FACULTY', 'DISABLED', 'ADMIN'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = role;
    }
    await user.save();
    res.json({ user: authService.toPublicUser(user) });
  } catch (e) {
    next(e);
  }
}

async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { me, list, updateUser, removeUser };
