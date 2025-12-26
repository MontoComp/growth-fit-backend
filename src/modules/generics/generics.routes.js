const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../shared/middlewares/jwt');
const { getGenericsRoles } = require('./generics.controller');

router.get('/generics/roles', jwtMiddleware, getGenericsRoles);

module.exports = router;
