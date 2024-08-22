import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authHeader from "../services/auth-header";


interface ProfileData {
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    password?: string;
}


const EditProfile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        nombre: '',
        apellido: '',
        email: '',
        username: '',
    });

    
    const navigate = useNavigate();
    useEffect(() => {
        // Simulando la carga de datos del usuario desde sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setProfileData((prevData) => ({
                ...prevData,
                username: parsedUser.username || '',
                nombre: parsedUser.nombre || '',
                apellido: parsedUser.apellido || '',
                email: parsedUser.email || '',

            }));
        }
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateData = { ...profileData };
        if (!updateData.password) {
            delete updateData.password;
        }

        try {
            const response = await fetch('/usuarios/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader().Authorization,
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                let name = JSON.parse(sessionStorage.getItem('user')!).username

                if(updateData.username !== name){
                    name = profileData.username;

                }
                const userResponse = await fetch('/usuarios/getUser?username=' +name, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: authHeader().Authorization,
                  },
                });
        
                if (userResponse.ok) {
                  const updatedUser = await userResponse.json();
                  // Obtener los datos actuales del sessionStorage
                  const storedUser = sessionStorage.getItem('user');
                  const currentUser = storedUser ? JSON.parse(storedUser) : {};
        
                  // Actualizar solo los campos deseados
                  const updatedProfile = {
                    ...currentUser,
                    nombre: updatedUser.data.nombre || currentUser.nombre,
                    apellido: updatedUser.data.apellido || currentUser.apellido,
                    email: updatedUser.data.email || currentUser.email,
                    username: updatedUser.data.username || currentUser.username,
                  };
        
                  // Guardar los datos actualizados en sessionStorage
                  sessionStorage.setItem('user', JSON.stringify(updatedProfile));
                  alert('Perfil actualizado con éxito');
                  navigate('/profile');
                } else {
                  alert('Error al obtener los datos del usuario actualizado');
                }
              } else {
                alert('Error al actualizar el perfil');
              }
            } catch (error) {
              console.error('Error:', error);
              alert('Error al actualizar el perfil');
            }
          };
        


    const handleCancel = () => {
        navigate(-1);  // Navegar hacia atrás en el historial
    };

    return (
        <div className='container'>
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Nombre</label>
                    <input
                        type="text"
                        className='form-control'
                        name="nombre"
                        value={profileData.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Apellido</label>
                    <input
                        type="text"
                        className='form-control'
                        name="apellido"
                        value={profileData.apellido}
                        onChange={handleChange}
                    />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Email</label>
                    <input
                        type="email"
                        className='form-control'
                        name="email"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                        value={profileData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Nombre de usuario</label>
                    <input
                        type="text"
                        className='form-control'
                        name="username"
                        pattern=".{3,30}"
                        value={profileData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Contraseña</label>
                    <input
                        type="password"
                        className='form-control'
                        name="password"
                        pattern=".{8,40}"
                        value={profileData.password || ''}
                        onChange={handleChange}
                        placeholder="Ingrese una contraseña solo si desea modificar la anterior"
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Repetir contraseña</label>
                    <input
                        type="password"
                        className='form-control'
                        name="Rpassword"
                        pattern={`^(${profileData.password})$`}
                        placeholder="Repetir contraseña"
                    />
                </div>

                <div className='d-flex mt-3'>

                    <button className=' me-2 btn btn-primary' type="submit">Guardar cambios</button>
                    <button className='btn btn-danger' type="button" onClick={handleCancel}>Cancelar</button>
                </div>

            </form>
        </div>
    );
};

export default EditProfile;
