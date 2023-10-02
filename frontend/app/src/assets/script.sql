INSERT INTO categorias (id, nombre)
VALUES
    (1, 'Planta Madre'),
    (2, 'Esquejes'),
    (3, 'Planta para semilla'),
    (4, 'Plantas para flores'),
    (5, 'Plantas para esquejes');

-- Esto en realidad no funciona por que si lo ingresamos en la base de datos, envers no lo registra en los logs y luego da errores
-- Ingresamos los datos de las plantas madres por postman
INSERT INTO lotes (id, codigo, cantidad, fecha, categoria_id, lote_padre, usuario_id, esHoja, deleted)
VALUES
    (1, '11', 1, '10-1-2023', 1, null, 1, true, false),
    (2, '22', 1, '10-1-2023', 1, null, 1, true, false),
    (3, '33', 1, '10-1-2023', 1, null, 1, true, false),
    (4, '44', 1, '10-1-2023', 1, null, 1, true, false),
    (5, '55', 1, '10-1-2023', 1, null, 1, true, false);

