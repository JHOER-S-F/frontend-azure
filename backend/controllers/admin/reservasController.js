const pool = require('../../config/db');

// Ver todas las reservas
exports.getReservas = async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT r.id, r.fecha, r.hora_inicio, r.hora_fin, r.fecha_creacion, c.nombre AS nombre_cancha, cli.nombre AS nombre_cliente, usu.nombre AS nombre_usuario ' +
            'FROM reservas r ' +
            'JOIN canchas c ON r.cancha_id = c.id ' +
            'JOIN clientes cli ON r.cliente_id = cli.id ' +  // Unimos la tabla clientes para obtener el nombre del cliente
            'JOIN usuarios usu ON r.usuario_id = usu.id'     // Unimos la tabla usuarios para obtener el nombre del usuario
        );
        res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ error: 'Error al obtener las reservas', details: error.message });
    }
};

// Ver una reserva por ID
exports.getReservaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query(
            'SELECT r.id, r.fecha, r.hora_inicio, r.hora_fin, r.fecha_creacion, c.nombre AS nombre_cancha, cli.nombre AS nombre_cliente, usu.nombre AS nombre_usuario ' +
            'FROM reservas r ' +
            'JOIN canchas c ON r.cancha_id = c.id ' +
            'JOIN clientes cli ON r.cliente_id = cli.id ' + // Unimos también la tabla clientes
            'JOIN usuarios usu ON r.usuario_id = usu.id ' + // Unimos la tabla usuarios
            'WHERE r.id = ?',
            [id]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        res.status(500).json({ error: 'Error al obtener la reserva', details: error.message });
    }
};

// Actualizar una reserva
exports.updateReserva = async (req, res) => {
    const { id } = req.params;
    const { cancha_id, fecha, hora_inicio, hora_fin, cliente_id } = req.body; // Cambié nombre_cliente por cliente_id
    try {
        const [reserva] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
        if (!reserva.length) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        // Actualizar la reserva
        await pool.query(
            'UPDATE reservas SET cancha_id = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, cliente_id = ? WHERE id = ?',
            [cancha_id, fecha, hora_inicio, hora_fin, cliente_id, id] // Cambié nombre_cliente por cliente_id
        );
        res.status(200).json({ message: 'Reserva actualizada' });
    } catch (error) {
        console.error('Error al actualizar la reserva:', error);
        res.status(500).json({ error: 'Error al actualizar la reserva', details: error.message });
    }
};

// Eliminar una reserva
exports.deleteReserva = async (req, res) => {
    const { id } = req.params;
    try {
        const [reserva] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
        if (!reserva.length) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
        res.status(200).json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        res.status(500).json({ error: 'Error al eliminar la reserva', details: error.message });
    }
};
