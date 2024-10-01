import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const tipoUsuario = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).ROL : null
        if (tipoUsuario) {
            if (tipoUsuario === 1) { // si es admin mandarlo a la page de admin
                navigate('/admin')
            } else if (tipoUsuario === 2) { // si es cliente mandarlo a la pagina de archivos
                navigate('/files')
            } else if (tipoUsuario === 3) { // si es cliente mandarlo a la pagina de archivos
                navigate('/employee')
            }
        } else {
            localStorage.removeItem('USUARIO')
            navigate('/')
        }

    }, [])

    return (
        <div>
        </div>
    )
}

export default HomePage;