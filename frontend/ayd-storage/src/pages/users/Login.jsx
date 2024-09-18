import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const user = localStorage.getItem('USUARIO')
        if(user) {
            navigate('/home')
        }
    }, [navigate])

    const handleUserEmailChange = (event) => {
        setUserEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/login?userEmail=${userEmail}&password=${password}`)

            if(!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to sign up!',
                    showConfirmButton: false,
                    timer: 2000
                });
                return
            }

            const data = await response.json()

            Swal.fire({
                icon: data.icon,
                title: data.message,
                showConfirmButton: false,
                timer: 2000
            });

            if(data.icon === 'success') {
                const {ID_USUARIO, NOMBRE, APELLIDO, USUARIO, EMAIL, NACIONALIDAD, PAIS_RESIDENCIA, CELULAR, ROL} = data.data
                localStorage.setItem('USUARIO', JSON.stringify({ID_USUARIO, NOMBRE, APELLIDO, USUARIO, EMAIL, NACIONALIDAD, PAIS_RESIDENCIA, CELULAR, ROL}))
                navigate('/home')
            }
        } catch(e) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to sign up!',
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    return (
        <Container
            component="main"
            maxWidth="100%"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#1e293a',
                boxShadow: 3,
                p: 3,
            }}
        >
            <Typography component="h1" variant="h5" sx={{ color: '#fff', mb: 2 }}>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={userEmail}
                    onChange={handleUserEmailChange}
                    autoFocus
                    InputLabelProps={{
                        style: { color: '#ccc' }
                    }}
                    InputProps={{
                        style: { color: '#fff' }
                    }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handlePasswordChange}
                    InputLabelProps={{
                        style: { color: '#ccc' }
                    }}
                    InputProps={{
                        style: { color: '#fff' }
                    }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                >
                    Login
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2, color: '#fff', borderColor: '#3f4a61', ':hover': { borderColor: '#fff' } }}
                    onClick={() => navigate("/signup")}
                >
                    Create Account
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2, color: '#fff', borderColor: '#3f4a61', ':hover': { borderColor: '#fff' } }}
                    onClick={() => navigate("/recovery")}
                >
                    Recovery Account
                </Button>
            </Box>
        </Container>
    );
};