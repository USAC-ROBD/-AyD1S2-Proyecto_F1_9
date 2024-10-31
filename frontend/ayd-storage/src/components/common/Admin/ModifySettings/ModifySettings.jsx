import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Swal from 'sweetalert2';

export default function ModifySettings() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [storagePackage, setStoragePackage] = useState('');
    const [storagePackageOptions] = useState([
        { label: 'Premium (150 GB)', value: 1 },
        { label: 'Standard (50 GB)', value: 2 },
        { label: 'Basic (15 GB)', value: 3 }
    ]);

    // Petición inicial para obtener todas las cuentas
    const getAllAccounts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/getAllAccounts`);
            const data = await response.json();
            if (response.ok) {
                setAccounts(data.data);
            } else {
                throw new Error('Error al obtener cuentas');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    useEffect(() => {
        getAllAccounts();
    }, []);

    const handleEditClick = (account) => {
        setSelectedAccount(account);
        setStoragePackage(account.id_paquete);
    };

    const handleDellClick = async (account) => {
        // Muestra el diálogo de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                // Realiza la petición
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/warningAccount`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_cuenta: account.id_cuenta,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Error al eliminar la cuenta');
                }
    
                // Si la petición fue exitosa, muestra un mensaje de éxito
                Swal.fire('Eliminada', 'La cuenta ha sido puesta en advertencia de liminación con éxito', 'success');
    
                // Actualizar la lista de cuentas después de la eliminación
                getAllAccounts();
            } catch (error) {
                // Muestra un mensaje de error en caso de fallo
                Swal.fire('Error', error.message, 'error');
            }
        }
    };
    

    const handlePackageChange = (e) => {
        setStoragePackage(e.target.value);
    };

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/updateAccounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_cuenta: selectedAccount.id_cuenta,
                    id_paquete: storagePackage
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la cuenta');
            }

            Swal.fire('Success', 'Account updated successfully', 'success');
            setSelectedAccount(null);
            getAllAccounts(); // Refrescar la tabla
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    return (
        <Container
            component="main"
            maxWidth="md"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#1e293a',
                p: 3,
            }}
        >
            <Typography component="h1" variant="h5" sx={{ color: '#fff', mb: 2 }}>
                Manage Accounts
            </Typography>

            {/* Tabla de cuentas */}
            {!selectedAccount && (
                <Table sx={{ bgcolor: '#233044', color: '#fff' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#ccc' }}>Usuario</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Editar</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Eliminar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.map((account) => (
                            <TableRow key={account.id_cuenta}>
                                <TableCell sx={{ color: '#fff' }}>{account.usuario}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                                        onClick={() => handleEditClick(account)}
                                    >
                                        Editar
                                    </Button>
                                </TableCell><TableCell>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                                        onClick={() => handleDellClick(account)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Formulario de edición */}
            {selectedAccount && (
                <Box component="form" onSubmit={handleUpdateAccount} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Usuario"
                        value={selectedAccount.usuario}
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        variant="outlined"
                        sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                        disabled
                    />

                    <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                        <InputLabel sx={{ color: '#ccc' }}>Paquete</InputLabel>
                        <Select
                            value={storagePackage}
                            onChange={handlePackageChange}
                            label="Paquete"
                            sx={{ color: '#fff' }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#233044', 
                                        '& .MuiMenuItem-root': {
                                            color: '#fff',
                                            '&.Mui-selected': {
                                                bgcolor: '#3f4a61',
                                                color: '#fff',
                                            },
                                            '&.Mui-selected:hover': {
                                                bgcolor: '#3f4a61', 
                                            },
                                            '&:hover': {
                                                bgcolor: '#3f4a61',
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            {storagePackageOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} sx={{ bgcolor: '#233044', color: '#fff' }}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                    >
                        Guardar
                    </Button>
                </Box>
            )}
        </Container>
    );
}
