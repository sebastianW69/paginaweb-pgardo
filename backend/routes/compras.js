// routes/compras.js
const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller');

router.post('/', comprasController.crearVenta); // POST /api/compras

module.exports = router;
