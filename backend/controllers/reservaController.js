const pool = require('../config/db');  // Conexión a la base de datos
const mysql = require('mysql2'); // Si no tienes esta dependencia, debes instalarla
const dayjs = require('dayjs');

// Función para convertir el BLOB de la imagen a base64
const convertBlobToBase64 = (blob) => {
    return blob.toString('base64');
};

// Obtener todos los clientes con su imagen
exports.getClientes = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM clientes');
        // Convertir las imágenes BLOB a base64 antes de enviar la respuesta
        const clientes = results.map(cliente => {
            if (cliente.imagen) {
                cliente.imagen = convertBlobToBase64(cliente.imagen);
            }
            return cliente;
        });

        res.status(200).json(clientes); // Enviar lista de clientes con imagen en base64
    } catch (err) {
        console.error('Error al obtener los clientes:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al obtener los clientes', error: err.message });
    }
};

// Obtener las canchas, filtradas opcionalmente por cliente_id
exports.getCanchas = async (req, res) => {
    const clienteId = req.query.cliente_id; // Obtener el cliente_id de los parámetros de consulta
    try {
        let query = 'SELECT * FROM canchas';
        const params = [];

        // Si se especifica un cliente_id, filtrar las canchas por cliente
        if (clienteId) {
            query += ' WHERE cliente_id = ?'; // Agregar la condición para filtrar por cliente_id
            params.push(clienteId);
        }

        const [results] = await pool.query(query, params);
        res.status(200).json(results); // Enviar la lista de canchas filtradas
    } catch (err) {
        console.error('Error al obtener las canchas:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al obtener las canchas', error: err.message });
    }
};


// Función para validar la existencia de una entidad en la base de datos
const validateEntityExists = async (tabla, id) => {
    const query = `SELECT 1 FROM ${tabla} WHERE id = ? LIMIT 1`;
    const [resultado] = await pool.query(query, [id]);
    return resultado.length > 0;
};

// Crear una reserva
exports.crearReserva = async (req, res) => {
    try {
        const { clienteId, canchaId, fecha, horaInicio, horaFin } = req.body;

        // Validar campos obligatorios
        if (!clienteId || !canchaId || !fecha || !horaInicio || !horaFin) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: clienteId, canchaId, fecha, horaInicio, horaFin.' });
        }

        // Verificar que horaInicio sea menor a horaFin
        if (dayjs(horaInicio, 'HH:mm').isAfter(dayjs(horaFin, 'HH:mm'))) {
            return res.status(400).json({ message: 'La hora de inicio debe ser menor a la hora de fin.' });
        }

        // Obtener el id del usuario desde el middleware de autenticación
        const usuarioId = req.userId; // Asumiendo que el middleware `verifyToken` coloca el `userId` en `req.userId`
        if (!usuarioId) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        // Validar existencia de cliente y cancha
        const clienteExiste = await validateEntityExists('clientes', clienteId);
        if (!clienteExiste) {
            return res.status(404).json({ message: 'El cliente no existe.' });
        }

        const canchaExiste = await validateEntityExists('canchas', canchaId);
        if (!canchaExiste) {
            return res.status(404).json({ message: 'La cancha no existe.' });
        }

        // Verificar conflictos de horario
        const queryConflicto = `
            SELECT * FROM reservas
            WHERE cancha_id = ? AND fecha = ? AND 
            (hora_inicio < ? AND hora_fin > ?)
        `;
        const [conflictos] = await pool.query(queryConflicto, [canchaId, fecha, horaFin, horaInicio]);

        if (conflictos.length > 0) {
            return res.status(409).json({ message: 'Conflicto de horario para esta cancha.' });
        }

        // Crear la reserva
        const query = `
            INSERT INTO reservas (usuario_id, cancha_id, cliente_id, fecha, hora_inicio, hora_fin)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const valores = [usuarioId, canchaId, clienteId, fecha, horaInicio, horaFin];
        const [resultado] = await pool.execute(query, valores);

        res.status(201).json({
            status: 'success',
            message: 'Reserva creada exitosamente.',
            data: { reservaId: resultado.insertId },
        });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};