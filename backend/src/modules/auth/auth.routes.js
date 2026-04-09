const { Router } = require('express');
const authController = require('./auth.controller');
const { registerRules, loginRules } = require('./auth.validation');
const { validateRequest } = require('../../utils/validation');

const r = Router();

r.post('/register', registerRules, validateRequest, authController.register);
r.post('/login', loginRules, validateRequest, authController.login);

module.exports = r;
