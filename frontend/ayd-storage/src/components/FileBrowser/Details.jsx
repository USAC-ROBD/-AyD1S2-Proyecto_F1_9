import { React } from 'react';
import { Modal, Box, Typography, Divider } from '@mui/material';

export default function Details({ details, visible, setVisible }) {

    function formatSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        
        const i = Math.floor(Math.log(bytes) / Math.log(1024)); // Determina el índice de la unidad
        const convertedValue = (bytes / Math.pow(1024, i)).toFixed(2); // Convierte el valor a la unidad adecuada
        
        return `${convertedValue} ${sizes[i]}`;
    }

    if (!visible) return null;

    return (
        <Modal
            open={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="file-modal-title"
            aria-describedby="file-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: '#2B3338',
                boxShadow: 24,
                p: 4,
                color: '#AAB8C2',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="file-modal-title" variant="h6" component="h2" sx={{ color: '#FFFFFF' }}>
                        Details
                    </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        <strong>Location:</strong> {details?.PATH}
                    </Typography>
                    <Divider sx={{ backgroundColor: '#FFFFFF', my: 1 }} />

                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        <strong>Name:</strong> {details?.NOMBRE}
                    </Typography>
                    <Divider sx={{ backgroundColor: '#FFFFFF', my: 1 }} />

                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        <strong>Type:</strong> {details?.TIPO}
                    </Typography>
                    <Divider sx={{ backgroundColor: '#FFFFFF', my: 1 }} />

                    {details.TIPO == 'File' && <><Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        <strong>Size:</strong> {formatSize(details?.TAMANO_B)}
                    </Typography>
                    <Divider sx={{ backgroundColor: '#FFFFFF', my: 1 }} /></>}

                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        <strong>Date Created:</strong> {details?.CREACION}
                    </Typography>
                    <Divider sx={{ backgroundColor: '#FFFFFF', my: 1 }} />

                    <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                        <strong>Date Modified:</strong> {details?.MODIFICACION}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
}