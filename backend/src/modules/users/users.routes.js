const { Router } = require('express');
const usersController = require('./users.controller');
const { authMiddleware, requireRoles } = require('../../common/middleware/auth.middleware');

const r = Router();

r.get('/me', authMiddleware, usersController.me);

r.get('/', authMiddleware, requireRoles('ADMIN'), usersController.list);
r.patch('/:id', authMiddleware, requireRoles('ADMIN'), usersController.updateUser);
r.delete('/:id', authMiddleware, requireRoles('ADMIN'), usersController.removeUser);

module.exports = r;
