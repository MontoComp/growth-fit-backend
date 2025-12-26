const express = require('express');
const router = express.Router();
const gymsController = require('./gyms.controller');
const jwtMiddleware = require('../../shared/middlewares/jwt');

router.get('/', jwtMiddleware, gymsController.getAllGyms);
router.post('/', jwtMiddleware, gymsController.createGym);
router.put('/:id', jwtMiddleware, gymsController.updateGym);
router.delete('/:id', jwtMiddleware, gymsController.deleteGym);

module.exports = router;
