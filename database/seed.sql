USE `reserva_futbol`;

-- Insertar datos iniciales en 'usuarios'
INSERT INTO `usuarios` (`nombre`, `correo`, `password`, `role`) VALUES
('Admin', 'admin@example.com', 'hashed_password_admin', 'admin'),
('Cliente', 'cliente@example.com', 'hashed_password_cliente', 'cliente'),
('Usuario', 'usuario@example.com', 'hashed_password_usuario', 'usuario');

-- Insertar datos iniciales en 'clientes'
INSERT INTO `clientes` (`nombre`, `direccion`, `telefono`, `correo`, `imagen`) VALUES
('Juan Perez', 'Av. Principal #123', '1234567890', 'juan@example.com', NULL),
('Maria Lopez', 'Calle Secundaria #456', '0987654321', 'maria@example.com', NULL);

-- Insertar datos iniciales en 'canchas'
INSERT INTO `canchas` (`nombre`, `direccion`, `cliente_id`) VALUES
('Cancha Central', 'Centro Deportivo A', 1),
('Cancha Norte', 'Complejo Deportivo B', 2);

-- Insertar datos iniciales en 'reservas'
INSERT INTO `reservas` (`cancha_id`, `fecha`, `hora_inicio`, `hora_fin`, `nombre_cliente`) VALUES
(1, '2024-11-25', '10:00:00', '12:00:00', 'Juan Perez'),
(2, '2024-11-26', '15:00:00', '17:00:00', 'Maria Lopez');

-- Insertar datos iniciales en 'preguntas'
INSERT INTO `preguntas` (`nombre`, `correo`, `mensaje`) VALUES
('Carlos Martinez', 'carlos@example.com', '¿Cuáles son los horarios disponibles?'),
('Ana Garcia', 'ana@example.com', '¿Puedo cancelar una reserva sin costo?');
