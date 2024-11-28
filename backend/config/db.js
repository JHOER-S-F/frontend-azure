// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// Importar el módulo mysql2/promise
const mysql = require('mysql2/promise');

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'jhoer-soccerbook-server.mysql.database.azure.com',    // Host de la base de datos, predeterminado a 'localhost'
    user: process.env.DB_USER || 'eqqbleprjd',          // Usuario de la base de datos, predeterminado a 'root'
    password: process.env.DB_PASSWORD || 'gduRTpCC5D8s$do4',      // Contraseña de la base de datos, predeterminado a vacío
    database: process.env.DB_NAME || 'reservas_futbol',  // Nombre de la base de datos, predeterminado a 'reservas_futbol'
    waitForConnections: true,                     // Esperar conexiones disponibles si el pool está lleno
    connectionLimit: 10,                          // Limitar el número de conexiones simultáneas a 10
    queueLimit: 0                                 // Sin límite de consultas en espera
});

// Exportar el pool para ser usado en otros módulos
module.exports = pool;

