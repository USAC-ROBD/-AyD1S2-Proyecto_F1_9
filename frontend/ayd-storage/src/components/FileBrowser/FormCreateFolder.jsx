import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Grid2 } from '@mui/material';
import TextField from '@mui/material/TextField';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1e293a',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function FormCreateFolder({ parentFolder, onCreateFolder }) {
    const [open, setOpen] = React.useState(false);
    const [folderName, setFolderName] = React.useState('');
    const [error, setError] = React.useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFolderName('');
    }

    const handleCreate = () => {
        // Validar que los campos no estén vacíos
        const idUSer = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).ID_USUARIO : undefined;
        const username = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).USUARIO : undefined;
        if (folderName && idUSer && parentFolder && username) {
            fetchCreateFolder(idUSer, username);
        } else {
            setError('Debes elegir un nombre para la carpeta');
        }
    }

    const fetchCreateFolder = async (idUSer, username) => {
        console.log(folderName);
        const data = {
            idUser: idUSer,
            username: username,
            parentFolder: parentFolder,
            name: folderName
        }

        fetch(`${process.env.REACT_APP_API_HOST}/createFolder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    console.log('Carpeta creada correctamente');
                    let folder = {
                        id: data.folder,
                        name: folderName
                    }
                    handleCreateFolder(folder)
                    handleClose();
                }
            })
            .catch(error => console.error('Error:', error));
    }

    const handleCreateFolder = (fileData) => {
        onCreateFolder(fileData);
    }

    // Función para convertir el archivo a base64
    const handleInputChange = (e) => {
        setFolderName(e.target.value);
    };

    return (
        <div>
            <Button
                sx={{
                    color: '#fff',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 0px 12px rgba(255, 255, 255, 0.68)',
                    },
                    border: '1px solid #fff',
                }}
                onClick={handleOpen}
            >
                <CreateNewFolderIcon sx={{ color: '#fff', fontSize: '2rem', marginRight: '5px' }} />
                Crear Carpeta
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'white' }}>
                        Crear Carpeta
                    </Typography>

                    <TextField
                        id="standard-basic"
                        placeholder='Nombre de la carpeta'
                        variant="outlined"
                        color="primary"
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
                        <Typography variant="body2" sx={{ color: 'red' }}>
                            {error}
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
                                Cancelar
                            </Button>
                        </Grid2>


                        <Grid2 item xs={12} ml={6}>
                            <Button
                                onClick={handleCreate}
                                fullWidth
                                sx={{
                                    color: '#fff',
                                    transition: 'box-shadow 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 0 10px rgba(27, 255, 0, 0.68)',
                                    },
                                    border: '1px solid rgba(27, 255, 0, 0.68)',
                                }}
                            >
                                Crear
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>
            </Modal>
        </div>
    );
}
