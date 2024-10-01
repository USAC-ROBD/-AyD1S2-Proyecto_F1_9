import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateAccount() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [country, setCountry] = useState('')
    const [idCountry, setIdCountry] = useState('')
    const [countryOptions, setCountryOptions] = useState([])
    const [nationality, setNationality] = useState('')
    const [phoneExtension, setPhoneExtension] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState(2);
    const [roleOptions, setRoleOptions] = useState([
        { label: 'Customer', value: 2 },
        { label: 'Employee', value: 3 }
    ]);
    const [storagePackage, setStoragePackage] = useState(1);
    const [storagePackageOptions] = useState([
        { label: 'Premium (150 GB)', value: 1 },
        { label: 'Standard (50 GB)', value: 2 },
        { label: 'Basic (15 GB)', value: 3 },
        { label: 'Ninguno', value: 4 }
    ]);
    const [user, setUser] = useState(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
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

    const handleCountryChange = (event) => {
        setCountry(event.target.value)
        const selectedCountry = countryOptions.find(c => c.name === event.target.value)
        setIdCountry(selectedCountry.id)
        setPhoneExtension(selectedCountry ? selectedCountry.code : '')
    };

    const handleNationalityChange = (event) => {
        setNationality(event.target.value);
    };

    const handlePhoneExtensionChange = (event) => {
        setPhoneExtension(event.target.value);
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handleRoleChange = (event) => {
        const newRole = event.target.value;
        setRole(newRole);
        if (newRole === 3) {
            setStoragePackage(4);
        }
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
                        lastName,
                        username,
                        password,
                        country: idCountry,
                        email,
                        nationality,
                        phone: `${phoneExtension}${phone}`,
                        role,
                        storagePackage,
                        confirmado:1,
                        crea: user
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

    const getCountries = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/getCountries`)
            if (!response.ok) {
                throw Error('Error al obtener paises disponibles')
            }
            const data = (await response.json()).data
            setCountryOptions(data)
        } catch (e) {
            console.error(e)
        }

    }

    useEffect(() => {
        const localStorage_user = JSON.parse(localStorage.getItem('USUARIO'));
        setUser(localStorage_user.USUARIO);
        getCountries()

        if (localStorage_user.ROL === 3) {
            setRoleOptions(prevOptions => prevOptions.filter(option => option.value !== 3));
        }
    }, [])

    useEffect(() => {
        if (role === 3) {
            setStoragePackage(4);
        }
    }, [role]);

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
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
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
                        id="lastname"
                        label="Last Name"
                        name="lastname"
                        autoComplete="lastname"
                        value={lastName}
                        onChange={handleLastNameChange}
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        variant="outlined"
                        sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                    />    
                </Box>            
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={handleUsernameChange}
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
                    <InputLabel sx={{ color: '#ccc' }}>Country Of Residence</InputLabel>
                    <Select
                        value={country}
                        required
                        onChange={handleCountryChange}
                        label="Country Of Residence"
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
                        {countryOptions.map((option) => (
                            <MenuItem
                                key={option.name}
                                value={option.name}
                                sx={{ bgcolor: '#233044', color: '#fff' }}
                            >
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Nationality</InputLabel>
                    <Select
                        value={nationality}
                        required
                        onChange={handleNationalityChange}
                        label="Nationality"
                        sx={{
                            color: '#fff'
                        }}
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
                        {countryOptions.map((country) => (
                            <MenuItem
                                key={country.name}
                                value={country.name}
                                sx={{ bgcolor: '#233044', color: '#fff' }}
                            >
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                        margin="normal"
                        required
                        id="code"
                        label="+ Code"
                        name="code"
                        value={phoneExtension}
                        onChange={handlePhoneExtensionChange}
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        variant="outlined"
                        sx={{ minWidth: { xs: '100%', sm: 120 }, bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        autoComplete="tel"
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        InputProps={{ style: { color: '#fff' } }}
                        variant="outlined"
                        sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                    />
                </Box>
                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Role</InputLabel>
                    <Select
                        value={role}
                        required
                        onChange={handleRoleChange}
                        label="Role"
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
                        {roleOptions.map((option) => (
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
                <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                    <InputLabel sx={{ color: '#ccc' }}>Storage Package</InputLabel>
                    <Select
                        value={storagePackage}
                        required
                        onChange={handleStoragePackageChange}
                        label="Storage Package"
                        sx={{ color: '#fff' }}
                        disabled={role === 3}
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
