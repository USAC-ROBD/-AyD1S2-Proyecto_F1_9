import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateAccount() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [role, setRole] = useState('Employee');
    const [storagePackage, setStoragePackage] = useState('Basic');
    const [storageOptions] = useState([
        { label: 'Premium (150 GB)', value: 'Premium' },
        { label: 'Standard (50 GB)', value: 'Standard' },
        { label: 'Basic (15 GB)', value: 'Basic' }
    ]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordMatch(event.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordMatch(event.target.value === password);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleStoragePackageChange = (event) => {
        setStoragePackage(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (passwordMatch) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/createAccount`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role,
                        storagePackage
                    }),
                });

                if (!response.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to create account!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }

                const data = await response.json();

                Swal.fire({
                    icon: data.icon,
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1500
                });

                if (data.icon === 'success') {
                    navigate("/");
                }
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to create account!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <Container
            component="main"
            maxWidth="xs"
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
                Create Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={handleNameChange}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirm-password"
                    label="Confirm Password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                    error={!passwordMatch}
                    helperText={!passwordMatch ? "Passwords do not match" : ""}
                />
                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Role</InputLabel>
                    <Select
                        value={role}
                        required
                        onChange={handleRoleChange}
                        label="Role"
                        sx={{ color: '#fff' }}
                    >
                        <MenuItem value="Employee" sx={{ bgcolor: '#233044', color: '#fff' }}>Employee</MenuItem>
                        <MenuItem value="Client" sx={{ bgcolor: '#233044', color: '#fff' }}>Client</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Storage Package</InputLabel>
                    <Select
                        value={storagePackage}
                        required
                        onChange={handleStoragePackageChange}
                        label="Storage Package"
                        sx={{ color: '#fff' }}
                    >
                        {storageOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{ bgcolor: '#233044', color: '#fff' }}
                            >
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
                    Create Account
                </Button>
            </Box>
        </Container>
    );
}
