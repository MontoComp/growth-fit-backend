const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../shared/middlewares/jwt');
const { getDashboardMetrics } = require('./dashboard.controller');

router.get('/metrics', jwtMiddleware, getDashboardMetrics);

module.exports = router;
