import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegar


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    setToken(tokenParam);
  }, [location.search]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    try {
      const response = await fetch(`/api/auth/reset-password?token=${token}&password=${password}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMessage('Contraseña actualizada correctamente.');
        setTimeout(() => {
          navigate('/login'); 
        }, 2000); 
      } else {
        setMessage('Hubo un error al enviar la solicitud. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      setMessage('Hubo un error al enviar la solicitud. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="container mt-3 container-auth">
      <div className="col-md-12">

        <div className="form-signup w-100 m-auto">
          <h2>Cambiar Contraseña</h2>
          <form onSubmit={handleSubmit}>
                            <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    pattern={`^(${password})$`}
                  />
                  <label htmlFor="con-password">Confirmar contraseña</label>
                  <div
                    className="invalid-feedback"
                    id="password-mismatch-error"
                  >
                    Las contraseñas no coinciden.
                  </div>
                </div>

            <button type="submit" className="btn btn-primary mt-3">Enviar</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}

        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
