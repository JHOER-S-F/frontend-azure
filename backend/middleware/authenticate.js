const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta'); // Reemplaza 'tu_clave_secreta' por tu clave real
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authenticate;
