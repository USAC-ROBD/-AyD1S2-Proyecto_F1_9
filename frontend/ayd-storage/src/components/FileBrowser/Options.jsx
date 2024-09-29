import { useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import Swal from 'sweetalert2';

export default function Options({ type, contextMenu, visible, setVisible, activeRename, activeDelete }) {
    const contextMenuRef = useRef(null);

    const handleDownload = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/download`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idFile: contextMenu.item.id, name: contextMenu.item.name })
        })

        const data = await response.json()

        Swal.fire({
            icon: data.icon,
            title: data.message,
            showConfirmButton: false,
            timer: data.icon === 'success' ? 800 : 2000
        });

        setVisible(false)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, setVisible]);

    if (!visible) return null;

    return (
        <Box
            ref={contextMenuRef}
            sx={{
                position: 'absolute',
                top: contextMenu.yPos,
                left: contextMenu.xPos - 240,
                backgroundColor: '#2c2c2c', // Fondo oscuro
                zIndex: 1000,
                p: 0,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', // Sombra más fuerte para tema oscuro
                borderRadius: 1,
                minWidth: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                overflow: 'hidden',
                '@media (max-width: 600px)': {
                    top: contextMenu.yPos - 56,
                    left: contextMenu.xPos,
                },
            }}
        >
            <Button
                variant="text"
                color="inherit"
                sx={{
                    p: 1,
                    width: '100%',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: '#ffffff', // Texto claro para el fondo oscuro
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Efecto hover sutil
                    },
                }}
                onClick={activeRename}
            >
                Rename
            </Button>
            
            {contextMenu.item.type === 'file' && <Button
                variant="text"
                color="inherit"
                sx={{
                    p: 1,
                    width: '100%',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: '#ffffff', // Texto claro para el fondo oscuro
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Efecto hover sutil
                    },
                }}
                onClick={handleDownload}
            >
                Download
            </Button>}

            <Button
                variant="text"
                color="inherit"
                sx={{
                    p: 1,
                    width: '100%',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: '#ff6b6b', // Texto rojo claro para Delete
                    '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.1)', // Hover para Delete
                    },
                }}
                onClick={activeDelete}
            >
                Delete
            </Button>
        </Box>
    );
}