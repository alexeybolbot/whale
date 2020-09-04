const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const refreshToken = require('../middleware/refreshToken');
const UserController = require('../controllers/user');

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);
router.get('/info', checkAuth, refreshToken, UserController.info);
router.get('/logout/:all', checkAuth, UserController.logout);

module.exports = router;
