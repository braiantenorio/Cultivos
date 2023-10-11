import React, { useState, ChangeEvent, FormEvent } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { login } from "../services/auth.service";


type Props = {}

const Login: React.FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    login(formData.username, formData.password).then(
      () => {
        //console.log("nose")
        navigate("/profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );


  };

  return (
    <div className="container mt-3">
      <div className="col-md-12">
        <div className="form-signin w-100 m-auto">
          <h2>Iniciar sesion</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <label htmlFor="username">Username</label>
            </div>

            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleInputChange}
              />
              <label htmlFor="password">Password</label>
            </div>


            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Iniciar sesion</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
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

export default Login;
