import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';

export default function ModifySettings() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [storage, setStorage] = useState('');
    const [name, setName] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('');
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    const [idCountry, setIdCountry] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePhoneChange = (e) => setPhone(e.target.value);
    const handleStorageChange = (e) => setStorage(e.target.value);
    const handleNameChange = (e) => setName(e.target.value);
    const handleSubscriptionStatusChange = (e) => setSubscriptionStatus(e.target.value);
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
        const selectedCountry = countries.find(c => c.name === e.target.value);
        setIdCountry(selectedCountry ? selectedCountry.id : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/updateSettings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    phone,
                    storage,
                    name,
                    subscriptionStatus,
                    country,
                    idCountry,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al modificar los ajustes');
            }
            Swal.fire('Success', 'Settings modified successfully', 'success');
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const getCountries = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/getCountries`);
        if (!response.ok) {
            throw Error('Error al obtener países disponibles');
        }
        const data = (await response.json()).data;
        setCountries(data);
    };

    useEffect(() => {
        getCountries();
    }, []);

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
                Modify Account Settings
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
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
                    label="Email"
                    name="email"
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
                    id="phone"
                    label="Phone"
                    name="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="storage"
                    label="Storage"
                    name="storage"
                    value={storage}
                    onChange={handleStorageChange}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    variant="outlined"
                    sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                />

                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Country</InputLabel>
                    <Select
                        value={country}
                        onChange={handleCountryChange}
                        label="Country"
                        sx={{ color: '#fff' }}
                    >
                        {countries.map((country) => (
                            <MenuItem
                                key={country.id} // Changed to use 'id' as key
                                value={country.name}
                                sx={{
                                    bgcolor: '#233044',
                                    color: '#fff',
                                    '&:hover': { bgcolor: '#2a3f60', color: '#fff' },
                                    '&.Mui-selected': { bgcolor: 'rgb(20, 35, 62)', color: '#fff' },
                                    '&.Mui-selected:hover': { bgcolor: 'rgb(20, 35, 62)', color: '#fff' },
                                    '&.Mui-focusVisible': { bgcolor: '#2a3f60', color: '#fff' },
                                    '&.Mui-focusVisible.Mui-selected': { bgcolor: 'rgb(20, 35, 62)', color: '#fff' },
                                }}
                            >
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Subscription Status</InputLabel>
                    <Select
                        value={subscriptionStatus}
                        onChange={handleSubscriptionStatusChange}
                        label="Subscription Status"
                        sx={{ color: '#fff' }}
                    >
                        <MenuItem value="active" sx={{ bgcolor: '#233044', color: '#fff' }}>Active</MenuItem>
                        <MenuItem value="inactive" sx={{ bgcolor: '#233044', color: '#fff' }}>Inactive</MenuItem>
                        <MenuItem value="expired" sx={{ bgcolor: '#233044', color: '#fff' }}>Expired</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                >
                    Save Settings
                </Button>
            </Box>
        </Container>
    );
}
