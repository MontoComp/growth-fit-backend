const express = require('express');
const router = express.Router();
const paymentsController = require('./payments.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/', jwtMiddleware, paymentsController.getPayments);
router.post('/', jwtMiddleware, paymentsController.createPayment);
router.put('/:id', jwtMiddleware, paymentsController.updatePayment);
router.delete('/:id', jwtMiddleware, paymentsController.deletePayment);

module.exports = router;
