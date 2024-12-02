const express = require('express');
const router = express.Router();
const { saveContactMessage } = require('../controllers/camController');

// Ruta para guardar el mensaje de contacto
router.post('/contact', saveContactMessage);

module.exports = router;

