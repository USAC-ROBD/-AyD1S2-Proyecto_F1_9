import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Grid2 } from '@mui/material';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Swal from 'sweetalert2';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '75%', md: '50%' },
    bgcolor: '#1e293a',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function FormShare({ visible, setVisible, file, handleUpdateFiles }) {
    const [userIdentifier, setUserIdentifier] = React.useState('');
    const [error, setError] = React.useState(null);

    const handleClose = () => {
        setVisible(false);
        setUserIdentifier('');
        setError(null);
    }

    const handleInputChange = (e) => {
        setUserIdentifier(e.target.value);
    }

    const handleSubmit = async () => {
        if (!userIdentifier) {
            setError('Please enter an email/username');
            return;
        }

        const currentUserId = JSON.parse(localStorage.getItem('USUARIO')).ID_USUARIO;
        const data = {
            userIdentifier: userIdentifier,
            idFile: file.id,
            currentUserId: currentUserId,
            type: file.type
        }

        axios.post(`${process.env.REACT_APP_API_HOST}/shareItem`, data)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    handleUpdateFiles();
                    setVisible(false);
                    setUserIdentifier('');
                    setError(null);
                    Swal.fire({
                        icon: 'success',
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }else {
                    if (response.data) {
                        setError(response.data.message);
                    }
                }
            })
            .catch(error => {
                let message  =  "Error sharing the file";
                if (error.response) {
                    if (error.response.data) {
                        message = error.response.data.message;
                    }
                }
                console.error('Error sharing the file:', error);
                setError(message);
            });
            
    }

    return (
        <div>

            <Modal
                open={visible}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'white' }}>
                        Share {file ? file.type : ''}
                    </Typography>

                    <p
                        style={{ color: 'white' }}
                    >Enter the email/username of the person you want to share the {file ? file.type : ''} with:</p>

                    <TextField
                        id="standard-basic"
                        placeholder='Email/username'
                        variant="outlined"
                        color="primary"
                        autoComplete='off'
                        onChange={handleInputChange}
                        sx={{
                            mb: 2,
                            width: '100%',
                            transition: 'box-shadow 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 0 10px white',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: '#fff', // Cambia el color del texto
                                '& fieldset': {
                                    borderColor: '#fff', // Cambia el color del borde
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff', // Cambia el color del borde al hacer hover
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#fff', // Cambia el color de la etiqueta
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#fff', // Mantén el color blanco cuando está enfocado
                            }
                        }}
                    />

                    {error && (
                        <Typography variant="body2" sx={{ color: 'red', mb: 2 }}>
                            *{error}
                        </Typography>
                    )}

                    <Grid2 container spacing={2}>


                        <Grid2 item xs={12} ml={6}>
                            <Button
                                onClick={handleClose}
                                sx={{
                                    color: '#fff',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 10px rgba(255, 56, 56, 0.83)',
                                    },
                                    border: '1px solid #d32f2f',
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid2>


                        <Grid2 item xs={12} ml={6}>
                            <Button
                                fullWidth
                                sx={{
                                    color: '#fff',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 10px rgba(27, 255, 0, 0.68)',
                                    },
                                    border: '1px solid rgba(27, 255, 0, 0.68)',
                                }}
                                onClick={handleSubmit}
                            >
                                Share
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>
            </Modal>
        </div>
    );
}
