import React, { useState } from 'react';

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/auth/forgot-password?email=' + email, {
        method: 'POST',
      });

      if (response.ok) {
        setMessage('Por favor, revisa tu correo electrónico para las instrucciones de recuperación.');
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
          <h2>Recuperar Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-2">
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Correo Electrónico</label>
            </div>
            <p>Ingrese su email para restablecer su contraseña.</p>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}

        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
