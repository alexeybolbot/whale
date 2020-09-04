const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const refreshToken = require('../middleware/refreshToken');
const LatencyController = require('../controllers/latency');

router.get('/', checkAuth, refreshToken, LatencyController.latency);

module.exports = router;
