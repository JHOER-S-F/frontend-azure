const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// Configuración de multer para almacenar imágenes en memoria y validar tipo de archivo y tamaño
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2 MB por archivo
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
    },
});

// Función para convertir el BLOB de la imagen a base64
const convertBlobToBase64 = (blob) => {
    return blob.toString('base64');
};

// Definir los roles permitidos
const validRoles = ['admin', 'cliente', 'usuario'];

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { nombre, correo, password, role } = req.body;
    const foto = req.file ? req.file.buffer : null;

    if (!nombre || !correo || !password || !role) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Validar que el role sea válido
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Role no válido' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            'INSERT INTO usuarios (nombre, correo, password, foto, role) VALUES (?, ?, ?, ?, ?)',
            [nombre, correo, hashedPassword, foto, role]
        );

        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, nombre, correo, foto, role FROM usuarios');

        rows.forEach((user) => {
            if (user.foto) {
                user.foto = convertBlobToBase64(user.foto);
            }
        });

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute(
            'SELECT id, nombre, correo, foto, role FROM usuarios WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (rows[0].foto) {
            rows[0].foto = convertBlobToBase64(rows[0].foto);
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, password, role } = req.body;
    const foto = req.file ? req.file.buffer : null;

    // Validar que el role sea válido si se proporciona
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Role no válido' });
    }

    let updateFields = [];
    let updateValues = [];

    if (nombre) {
        updateFields.push('nombre = ?');
        updateValues.push(nombre);
    }
    if (correo) {
        updateFields.push('correo = ?');
        updateValues.push(correo);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        updateValues.push(hashedPassword);
    }
    if (role) {
        updateFields.push('role = ?');
        updateValues.push(role);
    }
    if (foto) {
        updateFields.push('foto = ?');
        updateValues.push(foto);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    updateValues.push(id);

    try {
        const [result] = await pool.execute(
            `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// Manejo de errores de multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Error al cargar la imagen', error: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// Exportar las funciones y configuración de multer
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    upload,
    handleUploadError,
};
