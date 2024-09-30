import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';


const StorageBar = ({used, total}) => {

    if(used === undefined || used === null  || total === undefined || total === null){
        used = 0;
        total = 0;
    }

    var storagePercentage = ((used / total) * 100).toFixed(3); 
    if(isNaN(storagePercentage)){
        storagePercentage = 0;
    }
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
                Usado: {used}GB de {total}GB
            </Typography>
        </Box>
    );
};

export default StorageBar;