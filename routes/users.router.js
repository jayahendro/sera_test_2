const express = require('express');

const usersController = require('../controllers/users.controller');

const usersRouter = express.Router();

usersRouter.post('/', usersController.postUser);
usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:userId', usersController.getUser);
usersRouter.put('/:userId', usersController.putUser);
usersRouter.delete('/:userId', usersController.deleteUser);

module.exports = usersRouter;