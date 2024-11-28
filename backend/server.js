// Cargar variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { validationResult, ValidationError } = require('express-validator');
const pool = require('./config/db'); // Configuración de la base de datos
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const reservaRoutes = require('./routes/reservaRoutes'); // Rutas para reservas
const camRoutes = require('./routes/camRoutes'); // Rutas para mensajes de contacto
const clienteRoutes = require('./routes/clienteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifyToken = require('./middleware/verifyToken'); // Middleware de autenticación


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON
app.use(bodyParser.json());

// Rutas de la API
app.use('/api', clienteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/reservas', verifyToken, reservaRoutes); // Rutas protegidas para reservas
app.use('/api/cam', camRoutes); // Rutas para mensajes de contacto

// Sirviendo el frontend en producción
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    const express = require('express');

    // Sirve los archivos estáticos generados por Vue
    app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

    // Redirige todas las demás rutas al archivo index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    if (err instanceof ValidationError) {
        return res.status(400).json({ message: 'Error de validación', errors: err.array() });
    }
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});




// Conexión a la base de datos (asegurarse de que esté configurado correctamente)
pool.getConnection()
    .then(connection => {
        console.log("Conexión a la base de datos exitosa");
        connection.release();
    })
    .catch(err => {
        console.error("Error de conexión a la base de datos:", err);
    });