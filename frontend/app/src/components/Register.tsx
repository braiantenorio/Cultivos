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
  
  const [validated, setValidated] = useState(false);


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

    
    // Realizar la validación manualmente aquí
    if (formData.username.length < 3 || formData.username.length > 20) {
      setMessage("El nombre de usuario debe tener entre 3 y 20 caracteres.");
      setSuccessful(false);
      return;
    }
    // Validar el formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      setMessage("El correo electrónico no es válido.");
      setSuccessful(false);
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 40) {
      setMessage("La contraseña debe tener entre 6 y 40 caracteres.");
      setSuccessful(false);
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
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="name">Nombre</label>
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
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
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
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
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
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                  <button type="submit" className="btn btn-primary button-with-margin">
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
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
