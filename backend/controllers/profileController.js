const db = require('../config/db');
const multer = require('multer');

// Manejo de errores de Multer
const multerErrorHandling = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Error al subir el archivo: ' + err.message });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
  next();
};

// Obtener la información del usuario autenticado
const getUser = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'No autorizado. El token es inválido o ha expirado.' });
  }

  try {
    const [rows] = await db.execute('SELECT id, nombre, correo, foto, role FROM usuarios WHERE id = ?', [req.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = rows[0];
    if (user.foto) {
      user.fotoBase64 = Buffer.from(user.foto).toString('base64');
    }

    res.json({ message: 'Usuario encontrado.', data: user });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener las reservas del usuario autenticado
const getUserReservas = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'No autorizado. El token es inválido o ha expirado.' });
  }

  try {
    const [rows] = await db.execute('SELECT r.id, r.cancha_id, r.fecha, r.hora_inicio, r.hora_fin FROM reservas r WHERE r.usuario_id = ?', [req.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No tienes reservas registradas.' });
    }

    res.json({ message: 'Reservas obtenidas correctamente.', data: rows });
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar la foto de perfil del usuario
const updateProfileImage = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'No autorizado. El token es inválido o ha expirado.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No se ha cargado ninguna imagen.' });
  }

  const userId = req.userId;
  const imageBuffer = req.file.buffer;

  try {
    const [result] = await db.execute('UPDATE usuarios SET foto = ? WHERE id = ?', [imageBuffer, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Foto de perfil actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar la foto de perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Configuración de Multer para subir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

module.exports = {
  getUser,
  updateProfileImage,
  getUserReservas,
  upload,
  multerErrorHandling,
};
