import React, { useState, ChangeEvent, FormEvent } from "react";
import { register } from "../services/auth.service";

//import register from "../services/auth.service"

interface FormData {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }

    form.classList.add('was-validated')
    if (!form.checkValidity()) {
     return;
    }    
   
    register(
      formData.username,
      formData.email,
      formData.password,
      formData.nombre,
      formData.apellido
    ).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="container">
      <div className="col-md-12">
        <div className="form-signup w-100 m-auto">
          <h2>Crear usuario</h2>
          <form className="needs-validation" noValidate onSubmit={handleSubmit} >
            {!successful && (
              <div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    id="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$"
                  />
                  <label htmlFor="nombre">Nombre</label>
                  <div
                    className="invalid-feedback"
                    id="nombre-error"
                  >
                    Ingrese un nombre valido.
                  </div>
                </div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    id="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$"
                  />
                  <label htmlFor="apellido">Apellido</label>
                  <div
                    className="invalid-feedback"
                    id="apellido-error"
                  >
                    Ingrese un apellido valido.
                  </div>
                </div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    pattern=".{3,30}"
                    required
                  />
                  <label htmlFor="username">Nombre de usuario</label>
                  <div
                    className="invalid-feedback"
                    id="username-error"
                  >
                    Ingrese un nombre de usuario valido.
                  </div>
                </div>
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                  />
                  <label htmlFor="email">Email</label>
                  <div
                    className="invalid-feedback"
                    id="email-error"
                  >
                    Ingrese un email valido.
                  </div>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    pattern=".{8,40}"
                    required
                  />
                  <label htmlFor="password">Contraseña</label>
                  <div
                    className="invalid-feedback"
                    id="password-error"
                  >
                    Ingrese una contraseña valida.
                  </div>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="con-password"
                    id="con-password"
                    placeholder="Password"
                    required
                    pattern={`^(${formData.password})$`}
                  />
                  <label htmlFor="con-password">Confirmar contraseña</label>
                  <div
                    className="invalid-feedback"
                    id="password-mismatch-error"
                  >
                    Las contraseñas no coinciden.
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary component-with-margin">
                    Registrarse
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                   + " component-with-margin"}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </form>
          <div className="component-with-margin">
     
        <p><small>Si ya tienes una cuenta, <a href="/login">haz clic aquí para ingresar.</a></small></p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
