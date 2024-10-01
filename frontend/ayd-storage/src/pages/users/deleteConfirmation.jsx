import React, { useState, useEffect } from "react";
import { Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/Recovery.css';
import Swal from 'sweetalert2';

export default function DeleteAccuntMessage(){

    const navigate = useNavigate();
    const [correoElectronico, setCorreoElectronico] = useState('');

    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');        
        deleteAccountRequest(email);
        Swal.fire({
            icon: 'success',
            title: 'Delete account!',
            text: 'Your delete account request its in progress',
            showConfirmButton: false,
        });
        
    }, []);


    async function deleteAccountRequest(email_) {

        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/registerDeleteAccountRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email_ })
            });

            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error to delete account',
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Delete account!',
                    text: 'Your delete account request its in progress....',
                    showConfirmButton: false,
                    
                });

                navigate('/')
            }

        } catch (error) {
            console.error("Error al verificar el correo electrónico:", error)

        }
    }

    return (
        <div className="contenedor_recovery">
            <div className="recovery">
                <center>
                    <h2>Your delete account request its in progress :(</h2>
                    <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                        Go to login
                    </Button>
                </center>
            </div>

        </div>
    );

}