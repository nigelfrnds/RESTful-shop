const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.delete('/:id', checkAuth, UserController.deleteUser);

module.exports = router;
