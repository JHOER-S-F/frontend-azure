const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const reservaController = require('../controllers/reservaController');



// Rutas para clientesconst verifyToken = require('../middleware/verifyToken');

router.get('/clientes', reservaController.getClientes);

// Rutas para canchas
router.get('/canchas', reservaController.getCanchas);

// Rutas para reservas
router.post('/reservas', verifyToken, reservaController.crearReserva);

module.exports = router;




