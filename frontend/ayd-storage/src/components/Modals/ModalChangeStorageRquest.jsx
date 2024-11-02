import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import '../../styles/modal.css';

const ModalChangeStorageRequest = ({ open, handleClose, handleSubmit }) => {
    const [formData, setFormData] = useState({
        newStorage: ''
    });


    useEffect(() => {
        if (open) {

            var userData = JSON.parse(localStorage.getItem('USUARIO'));
            getCurrentUserStorage(userData.EMAIL);
        }
    }, [open]);

    async function getCurrentUserStorage(email_){        

        try {
    
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/getCurrentStorage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email:email_ })
            });

            const data = await response.json();
            
            if(data.status === 404){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No packages found!',
                    showConfirmButton: false,
                });
            } else {

                const selectElement = document.querySelector('select[name="newStorage"]');
                selectElement.innerHTML = '';

                data.data.forEach(paquete => { 

                    const option = document.createElement('option');
                    option.value = paquete.ID_PAQUETE;
                    option.text = paquete.NOMBRE;
                    document.querySelector('select[name="newStorage"]').appendChild(option);

                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }

    
        } catch (error) {
            console.error("Error al verificar el correo electrónico:", error);
        }
    }

    async function makeRequest(email_, id_paquete){
        try {
    
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/changeStorageRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email:email_, id_paquete: id_paquete })
            });

            const data = await response.json();
            
            if(data.status === 404){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error processing the request!',
                    showConfirmButton: false,
                });
            } else {

                
                Swal.fire({
                    icon: 'success',
                    title: 'Great :D',
                    text: 'The package change request has been made!',
                    showConfirmButton: false,
                });
            }
    
        } catch (error) {
            console.error("Error al verificar el correo electrónico:", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const onSubmit = (e) => {

        handleClose();
        e.preventDefault();
        handleSubmit(formData);        

        var userData = JSON.parse(localStorage.getItem('USUARIO'));
        makeRequest(userData.EMAIL, formData.newStorage);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Container>
                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            p: 3,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            STORAGE CHANGE REQUEST
                        </Typography>
                        <TextField
                            select
                            label="Select the new storage"
                            name="newStorage"
                            value={formData.newStorage}
                            onChange={handleChange}
                            fullWidth
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="" disabled>
                                Select the new storage
                            </option>
                            <option value="1">150 GB(Premium)</option>
                            <option value="2">50 GB(Standard)</option>
                            <option value="3">15 GB(Basic)</option>
                        </TextField>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="contained" color="primary" type="submit">
                                Ok
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </div>
        </div>
    );
};

export default ModalChangeStorageRequest;
