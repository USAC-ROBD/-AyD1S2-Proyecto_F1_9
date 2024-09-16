import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import UploadIcon from '@mui/icons-material/Upload';
import Typography from '@mui/material/Typography';
import { Grid2 } from '@mui/material';

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

export default function FormUploadFile({ parentFolder, onUploadFile }) {
    const [open, setOpen] = React.useState(false);
    const [fileBase64, setFileBase64] = React.useState(null);
    const [fileName, setFileName] = React.useState(null);
    const [fileType, setFileType] = React.useState(null);
    const [fileSize, setFileSize] = React.useState(null);
    const [error, setError] = React.useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFileBase64(null);
        setFileName(null);
    }

    const handleUpload = () => {
        // Validar que los campos no estén vacíos
        const idUSer = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).ID_USUARIO : undefined;
        const username = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).USUARIO : undefined;
        if (fileName && fileType && fileSize && parentFolder && fileBase64 && idUSer && username) {
            fetchUploadFile(idUSer, username);
        }else{
            setError('Debes seleccionar un archivo');
        }
    }

    const fetchUploadFile = async (idUSer, username) => {
        const base64 = fileBase64.split(',')[1];

        const data = {
            idUser: idUSer,
            username: username,
            folder: parentFolder,
            file: {
                name: fileName,
                size: fileSize,
                type: fileType,
                content: base64
            }
        }
    
        fetch(`${process.env.REACT_APP_API_HOST}/uploadFile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    console.log('Archivo subido correctamente');
                    let file = {
                        id: data.file,
                        name: fileName
                    }
                    handleUploadFile(file)
                    handleClose();
                }
            })
            .catch(error => console.error('Error:', error));
    }

    const handleUploadFile = (fileData) => {
        onUploadFile(fileData);
    }

    // Función para convertir el archivo a base64
    const handleFileChange = (e) => {
        try {
            setError(null);
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileBase64(reader.result);  // Guardar el archivo en base64
            };
            if (file) {
                setFileName(file.name);  // Guardar el nombre del archivo
                setFileType(file.type);  // Guardar el tipo del archivo
                setFileSize(file.size);  // Guardar el tamaño del archivo en bytes
                reader.readAsDataURL(file);  // Leer el archivo y convertirlo a base64
            }
        } catch (e) {
            console.log(e);
        }
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
                <UploadIcon sx={{ color: '#fff', fontSize: '2rem', marginRight: '5px' }} />
                Subir Archivo
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'white' }}>
                        Subir Archivo
                    </Typography>

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        bgcolor="#3f51b5"
                        sx={{
                            mb: 2,
                            color: '#fff',
                            transition: 'box-shadow 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 0 10px rgba(72, 91, 255, 0.74)',
                            },
                        }}
                    >
                        Seleccionar Archivo
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {
                        fileName && (
                            <Box>
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                    Archivo Seleccionado:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>
                                    {fileName}
                                </Typography>
                            </Box>

                        )
                    }

                    {
                        error && (
                            <Typography variant="body2" sx={{ color: 'red' }}>
                                {error}
                            </Typography>
                        )
                    }

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
                                onClick={handleUpload}
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
                                Subir
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>
            </Modal>
        </div>
    );
}
