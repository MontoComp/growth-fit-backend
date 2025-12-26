const express = require('express');
const router = express.Router();
const paymentsController = require('./payments.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/:clientid/payments', jwtMiddleware, paymentsController.getPaymentsByClient);
router.post('/:clientId/payments', jwtMiddleware, paymentsController.createPayment);
router.put('/payments/:id', jwtMiddleware, paymentsController.updatePayment);
router.delete('/payments/:id', jwtMiddleware, paymentsController.deletePayment);

module.exports = router;
