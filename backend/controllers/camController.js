const pool = require('../config/db'); // Asegúrate de que esté correctamente configurado

// Método para guardar mensaje de contacto en la base de datos
const saveContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  // Validación básica
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Inserción en la base de datos
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO preguntas (nombre, correo, mensaje) VALUES (?, ?, ?)',
      [name, email, message]
    );
    connection.release();

    // Respuesta exitosa
    return res.status(200).json({ success: 'Mensaje guardado en la base de datos correctamente.' });
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error);
    return res.status(500).json({ error: 'Error al guardar el mensaje en la base de datos.' });
  }
};

module.exports = { saveContactMessage };
