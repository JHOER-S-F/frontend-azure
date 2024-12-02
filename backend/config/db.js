const mysql = require('mysql2/promise');  // Usar la versión de promesas de mysql2
require('dotenv').config();
const fs = require('fs');

// Configura el pool de conexiones a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Tu contraseña
  database: process.env.DB_NAME || "reservas_futbol", // Tu base de datos
  port: 3306,
  ssl: {
    ca: fs.readFileSync(__dirname + "/../certs/DigiCertGlobalRootG2.crt.pem"), // Ruta al certificado
    rejectUnauthorized: false // Cambia a 'false' si es necesario
  }
});

// Verifica la conexión al iniciar
pool.getConnection()
  .then((connection) => {
    console.log("Conexión exitosa a MySQL flexible server en Azure.");
    connection.release();  // Libera la conexión para que pueda ser reutilizada
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

module.exports = pool;  // Exportar el pool de conexiones

