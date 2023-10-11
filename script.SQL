
INSERT INTO categorias (id,codigo,nombre) VALUES
(1,1,'Planta Madre'),
(2,2,'Clone'),
(3,3,'Planta Para Semillas'),
(4,4,'Planta Para Flores'),
(5,5,'semillas'),
(6,6,'Descarte');

INSERT INTO cultivares (id,codigo,nombre) VALUES
(1,1,'Agila'),
(2,2,'Amarilla De Lyon'),
(3,3,'Magna');


INSERT INTO categorias_sub_categorias  (categoria_id,sub_categorias_id) values
(1,2),
(1,6),
(2,3),
(2,4),
(2,6),
(3,5),
(3,6),
(4,6),
(5,6);


insert into atributos (id, nombre, tipo, obligatorio, caracteres, minimo, maximo, decimales) values
(1,'Cantidad de agua', 'string', true, 50,0,0,0),
(2, 'Tipo de poda','string', true, 50,0,0,0),
(3,'PH del agua','string', true, 50,0,0,0),
(4, 'Peso de los recortes','string', false, 50,0,0,0),
(5,'Tipo de Agua','string', false, 50,0,0,0);


insert into lista_de_atributos  (id, nombre) values
(1,'Riego'),
(2, 'Poda');


insert into listas_atributos  (lista_id, atributo_id) values
(1,1),
(1,3),
(1,5),
(2,2),
(2,4);


INSERT into tipo_agenda (id,categoria,version,deleted) values 
(1,'Planta Madre','estandar',false),
(2,'Clone','estandar',false),
(3,'Planta Para Flores','estandar',false);

insert into proceso_programado (id,cantidad,completado,dia_inicio,fechaarealizar,frecuencia,proceso_id) values
(1,5,false,2,null,3,1),
(2,1,false,20,null,0,2),
(3,3,false,1,null,3,1),
(4,7,false,1,null,2,1),
(5,1,false,20,null,0,2);

insert into tipo_agenda_procesos_programado (tipo_agenda_id,procesos_programado_id) values

(1,1),
(1,2),
(2,3),
(3,4),
(3,5);

insert into usuarios (id,apellido,nombre,email) values
(1,'tenorio','braian','tenoriovidalbraian@gmail.com')  


-- muy necesario, sino no sirven los usuarios
INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');


//despues crea un lote de categoria platan madre y otro de clone 