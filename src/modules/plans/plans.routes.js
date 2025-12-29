const express = require('express');
const router = express.Router();
const plansController = require('./plans.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/:gymId', jwtMiddleware, plansController.getPlansByGym);

module.exports = router;