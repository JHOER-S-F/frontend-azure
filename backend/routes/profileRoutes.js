const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  getUser,
  updateProfileImage,
  getUserReservas,
  upload,
  multerErrorHandling,
} = require("../controllers/profileController");

// Middleware para verificar el token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Obtener el token del header Authorization

  if (!token) {
    return res.status(401).json({ message: "No autorizado, token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado" });
    }
    req.userId = user.id;  // Asignar el id del usuario al objeto req para usarlo en los controladores
    next();
  });
};

// Ruta para obtener información del usuario autenticado
router.get("/user", authenticateToken, getUser);

// Ruta para obtener las reservas del usuario autenticado
router.get("/user/reservas", authenticateToken, getUserReservas);

// Ruta para actualizar la foto de perfil del usuario autenticado
router.post(
  "/user/update-image",
  authenticateToken,  // Añadir la protección para la foto de perfil
  upload,
  multerErrorHandling,
  updateProfileImage
);

module.exports = router;

