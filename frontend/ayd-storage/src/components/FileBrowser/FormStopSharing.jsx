import * as React from 'react';
import { useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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

export default function FormStopSharing({ visible, setVisible, file, handleUpdateFiles }) {
    const [user, setUser] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState('');
    const [error, setError] = React.useState(null);

    const handleClose = () => {
        setVisible(false);
        setUser('');
        setSelectedUser('');
        setError(null);
    }

    const handleUserChange = (e) => {
        setUser(e.target.value);
        setSelectedUser(e.target.value);
    }


    useEffect(() => {
        axiosGetUsers();
    }, [file]);

    const axiosGetUsers = async () => {
        if(!file){
            return;
        }

        const data = {
            idItem: file.id,
            type: file.type
        }

        axios.post(`${process.env.REACT_APP_API_HOST}/getUsersWithItemShared`, data)
            .then(response => {
                if (response.status === 200) {
                    setUsers(response.data.users);
                } else {
                    if (response.data) {
                        console.log(response.data.message);
                    }
                }

            })
            .catch(error => {
                let message = "Error getting the users with whom the item has been shared";
                if (error.response) {
                    if (error.response.data) {
                        message = error.response.data.message;
                    }
                }
                console.error('Error getting the users with whom the item has been shared:', error);
            });
    }

    const handleSubmit = async () => {
        if (!selectedUser) {
            setError('Please enter the user to stop sharing the file with');
            return;
        }

        const currentUserId = JSON.parse(localStorage.getItem('USUARIO')).ID_USUARIO;
        const data = {
            idItem: file.id,
            type: file.type,
            idUser: selectedUser
        }

        axios.post(`${process.env.REACT_APP_API_HOST}/stopSharing`, data)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    setVisible(false);
                    setUser('');
                    setSelectedUser('');
                    setError(null);
                    Swal.fire({
                        icon: 'success',
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    handleUpdateFiles();
                } else {
                    if (response.data) {
                        setError(response.data.message);
                    }
                }
            })
            .catch(error => {
                let message = "Error sharing the file";
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
                        Stop sharing {file ? file.type : ''}
                    </Typography>

                    <p
                        style={{ color: 'white' }}
                    >Enter the email/username of the person you want to stop sharing the {file ? file.type : ''} with:</p>

                    <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1, mb: 2 }}>
                        <InputLabel sx={{ color: '#ccc' }}>User</InputLabel>
                        <Select
                            value={selectedUser}
                            required
                            onChange={handleUserChange}
                            label="User"
                            sx={{
                                color: '#fff'
                            }}
                        >
                            {users.map((user) => (
                                <MenuItem
                                    key={user.USUARIO}
                                    value={user.ID_USUARIO}
                                    sx={{
                                        bgcolor: '#233044',
                                        color: '#fff',
                                        '&:hover': { bgcolor: '#2a3f60', color: '#fff', },
                                        "&.Mui-selected": { bgcolor: 'rgb(20, 35, 62)', color: '#fff', },
                                        '&.Mui-selected:hover': { bgcolor: 'rgb(20, 35, 62)', color: '#fff', },
                                        '&.Mui-focusVisible': { bgcolor: '#2a3f60', color: '#fff', },
                                        '&.Mui-focusVisible.Mui-selected': { bgcolor: 'rgb(20, 35, 62)', color: '#fff', },
                                    }}
                                >
                                    {user.USUARIO} - {user.EMAIL}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
                                Stop Sharing
                            </Button>
                        </Grid2>
                    </Grid2>
                </Box>
            </Modal>
        </div>
    );
}
