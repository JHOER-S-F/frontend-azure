const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middleware/verifyToken');
const multerErrorHandling = require('../controllers/profileController').multerErrorHandling;

// Verificar el token para proteger las rutas de perfil
router.use(verifyToken);

// Obtener los datos del perfil del usuario
router.get('/perfil', profileController.getUser);

// Obtener las reservas del usuario
router.get('/reservas', profileController.getUserReservas);

// Subir una nueva foto de perfil
router.post('/perfil/foto', profileController.upload, multerErrorHandling, profileController.updateProfileImage);

module.exports = router;


