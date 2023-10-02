INSERT INTO categorias (id,nombre) VALUES
(1,'Planta Madre'),
(2,'Clone'),
(3,'Planta Para Semillas'),
(4,'Planta Para Flores'),
(5,'semillas'),
(6,'Descarte')

INSERT INTO categorias_sub_categorias  (categoria_id,sub_categorias_id) values
(1,2),
(1,6),
(2,3),
(2,4),
(2,6),
(3,5),
(3,6),
(4,6),
(5,6)

INSERT into tipo_agenda (id,categoria,version,deleted) values 

(1,'Planta Madre','estandar',false),
(2,'Clone','estandar',false),
(3,'Planta Para Flores','estandar',false)

insert into proceso_programado 
(id,cantidad,completado,dia_inicio,fechaarealizar,frecuencia,proceso) values

(1,1,false,1,null,0,'siembra'),
(2,5,false,2,null,3,'regar'),
(3,1,false,20,null,0,'podar'),
(4,3,false,15,null,1,'fertilizar'),
(5,1,false,1,null,0,'siembra'),
(6,5,false,2,null,1,'Sacar tierra'),
(7,3,false,1,null,3,'regar'),
(8,1,false,15,null,0,'Cambiar de temperatura'),
(9,7,false,1,null,2,'regar'),
(10,1,false,20,null,0,'podar'),
(11,1,false,25,null,0,'cosechar')


insert into tipo_agenda_procesos_programado (tipo_agenda_id,procesos_programado_id) values

(1,1),
(1,2),
(1,3),
(1,4),
(2,5),
(2,6),
(2,7),
(2,8),
(3,9),
(3,10),
(3,11)

insert into usuarios (id,apellido,nombre,email) values
(1,'tenorio','braian','tenoriovidalbraian@gmail.com')  

//despues crea un lote de categoria platan madre y otro de clone   