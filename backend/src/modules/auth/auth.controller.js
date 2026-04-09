const authService = require('./auth.service');

async function register(req, res, next) {
  try {
    const { email, password, full_name, role } = req.body;
    const result = await authService.register({ email, password, full_name, role });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login };
