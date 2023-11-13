
INSERT INTO categorias (id,codigo,nombre,limite,deleted) VALUES
(1,1,'Planta Madre',true,false),
(2,2,'Clone',false,false),
(3,3,'Planta Para Semillas',true,false),
(4,4,'Planta Para Flores',true,false),
(5,5,'semillas',false,false),
(6,6,'Descarte',true,false),
(7,7,'Cosecha de Flores',true,false);

INSERT INTO cultivares (id,codigo,nombre,deleted) VALUES
(1,1,'Agila',false),
(2,2,'Amarilla De Lyon',false),
(3,3,'Magna',false);


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


insert into atributos (id, nombre, tipo, obligatorio, caracteres, minimo, maximo, decimales,deleted) values
(1,'Cantidad de agua', 'number', true, 50,0,10000,0,false),
(2, 'Tipo de poda','string', true, 50,0,0,0,false),
(3,'PH del agua','number', false, 50,0,14,0,false),
(4, 'Peso de los recortes','number', true, 50,0,10000,0,false),
(5,'Tipo de Agua','string', true, 50,0,0,0,false),
(6,'Rendimiento en gramos','number',true, 50,0,10000,0,false);


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