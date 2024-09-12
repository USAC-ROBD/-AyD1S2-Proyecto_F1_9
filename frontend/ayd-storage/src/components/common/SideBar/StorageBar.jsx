import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const StorageBar = () => {
    // Calcula el porcentaje de almacenamiento utilizado
    const [usedStorage, setUsedStorage] = useState(10);
    const [totalStorage, setTotalStorage] = useState(100); //varia dependiendo del plan del usuario
    const storagePercentage = (usedStorage / totalStorage) * 100;

    useEffect(() => {
        //TODO: Obtener el espacio de almacenamiento utilizado y total del usuario
    }, []);

    return (
        <Box sx={{
            width: '75%',  // Ajusta el ancho de la barra
            margin: '0 auto',  // Centra horizontalmente el contenedor
            textAlign: 'center'  // Centra el texto

        }}>
            <LinearProgress
                variant="determinate"
                value={storagePercentage}
                sx={{ height: 20, borderRadius: 5, marginTop: 1 }}
            />
            <Typography variant="caption">
                Usado: {usedStorage} GB de {totalStorage} GB
            </Typography>
        </Box>
    );
};

export default StorageBar;