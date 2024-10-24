import { React, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import Swal from 'sweetalert2';

export default function Options({ contextMenu, visible, setVisible, activeRename, activeDetails, activeAddTags, activeDelete, activeRestore, esPapelera, activeShare, onSetFavItem, activeStopShare, showStopShare }) {
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

        if(response.ok) {
            try {
                const response = await fetch(`${process.env.REACT_APP_S3_URL}/${data.url}`);
                const blob = await response.blob();
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.setAttribute('download', contextMenu.item.name); // Nombre del archivo para la descarga
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url); // Liberar memoria
            } catch (error) {
                console.error('Error downloading the file:', error);
            }

            setVisible(false)
            return
        }

        Swal.fire({
            icon: data.icon,
            title: data.message,
            showConfirmButton: false,
            timer: 2000
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

    const fetchSetFavItem = async (idItem, type) => {
        if (!idItem || !type) return;
        fetch(`${process.env.REACT_APP_API_HOST}/setFavorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idItem, type })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const usuario = JSON.parse(localStorage.getItem('USUARIO'));
                    if (data.fav === 1) {
                        Swal.fire('Added to favorites')
                    } else {
                        Swal.fire('Removed from favorites')
                        onSetFavItem(usuario.ID_CUENTA, contextMenu.idFolder);
                    }
                } else {
                    Swal.fire('Error', 'An error occurred', 'error');
                }
            })
            .catch(error => console.error('Error:', error));
    };

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
            {!esPapelera && (
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
            )}

            {!esPapelera && (
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
                    onClick={activeDetails}
                >
                    Details
                </Button>
            )}

            {contextMenu.item.type !== 'file' && !esPapelera && (
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
                    onClick={activeAddTags}
                >
                    Tags
                </Button>
            )}

            {contextMenu.item.type === 'file' && !esPapelera && <Button
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

            {!esPapelera && <Button
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
                onClick={() => fetchSetFavItem(contextMenu.item.id, contextMenu.item.type)}
            >
                {contextMenu.item.favorite === 1 ? 'Remove from favorites' : 'Add to favorites'}
            </Button>}

            {!esPapelera && (
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
                    onClick={activeShare}
                >
                    Share
                </Button>
            )}

            {!esPapelera && showStopShare && (
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
                    onClick={activeStopShare}
                >
                    Stop sharing
                </Button>
            )}

            {!esPapelera && (
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
            )}


            {esPapelera && (
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
                    onClick={activeRestore}
                >
                    Restore
                </Button>
            )}

        </Box>
    );
}