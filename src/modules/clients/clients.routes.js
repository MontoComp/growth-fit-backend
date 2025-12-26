const express = require('express');
const router = express.Router();
const clientsController = require('./clients.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/', jwtMiddleware, clientsController.getClients);
router.post('/', jwtMiddleware, clientsController.createClient);
router.put('/:id', jwtMiddleware, clientsController.updateClient);
router.delete('/:id', jwtMiddleware, clientsController.deleteClient);

module.exports = router;
