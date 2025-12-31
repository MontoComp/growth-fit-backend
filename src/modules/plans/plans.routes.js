const express = require('express');
const router = express.Router();
const plansController = require('./plans.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/:gymId', jwtMiddleware, plansController.getPlansByGym);
router.post('/', jwtMiddleware, plansController.createPlan);
router.put('/:id', jwtMiddleware, plansController.updatePlan);
router.delete('/:id', jwtMiddleware, plansController.deletePlan);

module.exports = router;