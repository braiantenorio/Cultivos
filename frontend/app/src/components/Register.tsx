import React, { useState, ChangeEvent, FormEvent } from "react";
import { register } from "../services/auth.service";

//import register from "../services/auth.service"

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
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

    // Aquí puedes realizar la llamada a tu función de registro
    // Supongamos que tienes una función register que realiza la llamad
     register(formData.username, formData.email, formData.password).then(
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
           error.toString()
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
          <form onSubmit={handleSubmit}>
            {!successful && (
              <div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="username">Nombre de usuario</label>
                </div>
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="password">Contraseña</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="con-password"
                    id="con-password"
                    placeholder="Password"
                  />
                  <label htmlFor="con-password">Confirmar contraseña</label>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
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
