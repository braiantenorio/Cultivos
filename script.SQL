
INSERT INTO categorias (id,codigo,nombre,limite) VALUES
(1,1,'Planta Madre',true),
(2,2,'Clone',false),
(3,3,'Planta Para Semillas',true),
(4,4,'Planta Para Flores',true),
(5,5,'semillas',false),
(6,6,'Descarte',true),
(7,7,'Cosecha de Flores',true);

INSERT INTO cultivares (id,codigo,nombre) VALUES
(1,1,'Agila'),
(2,2,'Amarilla De Lyon'),
(3,3,'Magna');


INSERT INTO categorias_sub_categorias  (categoria_id,sub_categorias_id) values
(1,2),
(1,6),
(2,1),
(2,3),
(2,4),
(2,6),
(3,5),
(3,6),
(4,6),
(4,7),
(5,6);


insert into atributos (id, nombre, tipo, obligatorio, caracteres, minimo, maximo, decimales) values
(1,'Cantidad de agua', 'string', true, 50,0,0,0),
(2, 'Tipo de poda','string', true, 50,0,0,0),
(3,'PH del agua','string', true, 50,0,0,0),
(4, 'Peso de los recortes','string', false, 50,0,0,0),
(5,'Tipo de Agua','string', true, 50,0,0,0),
(6,'Rendimiento en gramos','string',true, 50,0,0,0);


insert into lista_de_atributos  (id, nombre) values
(1,'Riego'),
(2,'Poda'),
(3,'Recoleccion de flores');


insert into listas_atributos  (lista_id, atributo_id) values
(1,1),
(1,3),
(1,5),
(2,2),
(2,4),
(3,6);


INSERT into tipo_agenda (id,categoria_id ,version,deleted) values 
(1,1,'estandar',false),
(2,2,'estandar',false),
(3,4,'estandar',false),
(4,7,'estandar',false);

insert into proceso_programado (id,cantidad,completado,dia_inicio,fechaarealizar,frecuencia,proceso_id) values
(1,5,false,2,null,3,1),
(2,1,false,20,null,0,2),
(3,3,false,1,null,3,1),
(4,7,false,1,null,2,1),
(5,1,false,20,null,0,2),
(6,1,false,1,null,0,3);

insert into tipo_agenda_procesos_programado (tipo_agenda_id,procesos_programado_id) values

(1,1),
(1,2),
(2,3),
(3,4),
(3,5),
(4,6);


INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');
