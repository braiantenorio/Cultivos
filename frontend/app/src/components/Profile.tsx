import React from "react";
import { getCurrentUser } from "../services/auth.service";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h2>
           Perfil
        </h2>
      </header>
      <p>
        <strong>Nombre:</strong> {currentUser.nombre}
      </p>
      <p>
        <strong>Apellido:</strong> {currentUser.apellido}
      </p>
      <p>
        <strong>Nombre de usuario:</strong> {currentUser.username}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Autorización:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}
      </ul>

      <div>
      <Link to="/edit-profile">
        <button className="btn btn-primary">
          Editar perfil
        </button>
      </Link>
    </div>
    </div>
  );
};

export default Profile;