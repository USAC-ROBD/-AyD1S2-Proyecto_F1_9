import React from "react";
import '../styles/Recovery.css';
import Swal from 'sweetalert2';
import { transporter, getMailOptions } from '../email/nodemailer.mjs'



export default function Recovery() {
    
    var [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubmit = (event) => {

        event.preventDefault();       
        recuperarContrasena(event.target.email.value);

    };

    
    async function recuperarContrasena(email_) {

        try {

            const response = await fetch("http://localhost:4000/recovery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email_ })
            });

            const data = await response.json();

            if (data.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Correo electrónico no encontrado!',
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado!',
                    text: 'Revisa tu correo para recuperar tu cuenta te esperamos :D',
                    showConfirmButton: false,
                });
                setIsSubmitted(true);
            }



        } catch (error) {
            console.error("Error al verificar el correo electrónico:", error);
        }
    }

    // ...

    return (
        <div className="contenedor_recovery">
            
            {isSubmitted ? (
                <div>
                    <center>
                        <h2>RECUPERAR CUENTA</h2>
                        <span>Revisa tu correo para recuperar tu cuenta te esperamos :D</span>
                    </center>
                </div>
            ):(
            
            <form onSubmit={handleSubmit}>
                <center>
                    <h2>RECUPERAR CUENTA</h2>
                    <span>Si olvidaste tu contraseña ingresa tu email para proceder!</span>
                    <div>                       
                        <input
                            placeholder="Ingresa tu email"
                            type="email"
                            margin="normal"
                            required
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            className="email_input"
                            variant="outlined"
                        />
                    </div>
                    <button className="custom-button" type="submit">Submit</button>
                </center>
            </form>)
            }
        </div>
    );
};