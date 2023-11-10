import React from "react";
import { getCurrentUser } from "../services/auth.service";

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Perfil
        </h3>
      </header>
      <p>
        <strong>Nombre:</strong> {currentUser.nombre}
      </p>
      <p>
        <strong>Apellido:</strong> {currentUser.apellido}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Autorización:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;