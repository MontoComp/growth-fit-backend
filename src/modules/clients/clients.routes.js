const express = require('express');
const router = express.Router();
const clientsController = require('./clients.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/:gymId', jwtMiddleware, clientsController.getClientsByGym);
router.post('/', jwtMiddleware, clientsController.createClient);
router.put('/:id', jwtMiddleware, clientsController.updateClient);
router.delete('/:id', jwtMiddleware, clientsController.deleteClient);

module.exports = router;
