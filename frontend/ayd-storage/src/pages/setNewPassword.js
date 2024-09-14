
import React, { useState, useEffect } from "react";
import '../styles/Recovery.css';
import Swal from 'sweetalert2';

export default function SetNewPassword() {

    var [isSubmitted, setIsSubmitted] = React.useState(false); //verficiar si se renderiza el mensaje de exito :D

    const [correoElectronico, setCorreoElectronico] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        setCorreoElectronico(email);
    }, []);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden',
                showConfirmButton: false,
            });
            return;
        } 

        establecerContrasena(correoElectronico, password);

    };

    async function establecerContrasena(email_, password_) {
        console.log(email_, password_);
    
        try {
            const response = await fetch("http://localhost:4000/setNewPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email_, password: password_ })
            });
    
            const data = await response.json();
            console.log(data);
    
            if (!response.ok) {
                throw new Error(data.message || 'Error desconocido');
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada!',
                text: 'Contraseña actualizada con éxito :D',
                showConfirmButton: false,
            });
            setIsSubmitted(true);
    
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message || 'Ocurrió un error al actualizar la contraseña',
                showConfirmButton: true,
            });
        }
    }

    return (
        <div className="contenedor_recovery">

            {isSubmitted ? (
                <div>
                    <center>
                        <h2>Nueva contraseña</h2>
                        <span>Contraseña actualizada con éxito :D</span>
                    </center>
                </div>

            ) :(
                <center>
                    <form onSubmit={handleSubmit}>
                        
                        <h2>Nueva contraseña</h2>
                        <span>Ingresa una contraseña nueva para poder acceder de nuevo :D</span>
            
                        <div>
                            
                            <input
                                placeholder="Ingresa tu contraseña"
                                className="email_input"
                                required
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Confirma tu contraseña"
                                className="email_input"
                                required
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                        </div>
                        <button className="custom-button" type="submit">Submit</button>
                    </form>
                </center>)}
        </div>
    );
}