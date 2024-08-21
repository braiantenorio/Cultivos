INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_MODERATOR');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');

INSERT INTO usuarios (id, nombre,apellido,email,username, password) VALUES
(1, 'admin','admin','admin@gmail.com','admin', '$2a$12$De8WtfX53AyrD9orwSFWHeJyqyt8er5iQ3Nt071juOwUK84/T8F2m');

INSERT INTO user_roles(user_id,role_id) VALUES
(1,3);
