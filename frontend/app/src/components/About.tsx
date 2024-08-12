// src/About.tsx
import React from 'react';

const About: React.FC = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Acerca de Nosotros</h1>
            <p>
                Este software fue desarrollado como parte de un proyecto para la materia Desarrollo de Software en la Universidad Nacional Patagónica San Juan Bosco. Los estudiantes Cristian Camacho y Braian Tenorio, de la carrera de Licenciatura en Informática, llevaron a cabo la programación del software bajo la supervisión de los profesores Ernesto Mallorca y Cristian Pacheco.
            </p>
            <p>
                Agradecemos el uso de nuestra aplicación. A continuación, encontrarás nuestra información de contacto.
            </p>

            <div className="row">
                <div className="col-md-6 mb-2">
                    <ul className="list-unstyled">
                        <li>
                            <strong>Cristian Camacho</strong>
                        </li>
                        <li>
                            <a href="mailto:criistian13062000@gmail.com ">criistian13062000@gmail.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <ul className="list-unstyled">
                        <li>
                            <strong>Braian Tenorio</strong>
                        </li>
                        <li>
                            <a href="mailto:tenoriovidalbraian@gmail.com">tenoriovidalbraian@gmail.com</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default About;
