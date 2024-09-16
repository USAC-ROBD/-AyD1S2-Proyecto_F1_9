import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';

export default function Signup() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(true)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [idCountry, setIdCountry] = useState('')
    const [nationality, setNationality] = useState('')
    const [phoneExtension, setPhoneExtension] = useState('')
    const [phone, setPhone] = useState('')
    const [countries, setCountries] = useState([])
    const [plans, setPlans] = useState([])
    const [idPlan, setIdPlan] = useState('')
    const [plan, setPlan] = useState('')

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    const handleUserameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordMatch(event.target.value === confirmPassword)
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordMatch(event.target.value === password)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleCountryChange = (event) => {
        setCountry(event.target.value)
        const selectedCountry = countries.find(c => c.name === event.target.value)
        setIdCountry(selectedCountry.id)
        setPhoneExtension(selectedCountry ? selectedCountry.code : '')
    }

    const handlePlanChange = (event) => {
        setPlan(event.target.value)
        setIdPlan(event.target.value)
    }

    const handleNationalityChange = (event) => {
        setNationality(event.target.value)
    }

    const handlePhoneExtensionChange = (event) => {
        setPhoneExtension(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    }

    const getCountries = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/getCountries`)
            if (!response.ok) {
                throw Error('Error al obtener paises disponibles')
            }
            const data = (await response.json()).data
            setCountries(data)
        } catch (e) {
            console.error(e)
        }

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (passwordMatch) {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/signup`, {
                    method: 'POST', // Especifica que el método es POST
                    headers: {
                        'Content-Type': 'application/json', // Especifica el tipo de contenido que estás enviando
                    },
                    body: JSON.stringify({
                        name,
                        lastName,
                        username,
                        password,
                        email,
                        country: idCountry,
                        nationality,
                        phone: `${phoneExtension}${phone}`,
                        plan: idPlan
                    })
                })

                if (!response.ok) {
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

                if (data.icon === 'success') {
                    navigate("/")
                }
                return
            }
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match!',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to sign up!',
                showConfirmButton: false,
                timer: 2000
            });
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('USUARIO')
        if (user) {
            navigate('/home')
        }
    }, [navigate])

    useEffect(() => {
        getCountries()
    }, [])

    useEffect(() => {
        setPlans([{
            id: 3,
            name: 'Basic',
            storage: 15
        }, {
            id: 2,
            name: 'Standard',
            storage: 50
        }, {
            id: 1,
            name: 'Premium',
            storage: 150
        }])
    }, [])

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
                Sign Up
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
                        autoFocus
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

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={handleUserameChange}
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
                </Box>

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
                        sx={{
                            color: '#fff'
                        }}
                    >
                        {countries.map((country) => (
                            <MenuItem
                                key={country.name}
                                value={country.name}
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
                                {country.name}
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
                    >
                        {countries.map((country) => (
                            <MenuItem
                                key={country.name}
                                value={country.name}
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
                    <InputLabel sx={{ color: '#ccc' }}>Storage Plan</InputLabel>
                    <Select
                        value={plan}
                        required
                        onChange={handlePlanChange}
                        label="Storage Plan"
                        sx={{
                            color: '#fff'
                        }}
                    >
                        {plans.map((plan) => (
                            <MenuItem
                                key={plan.name}
                                value={plan.id}
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
                                {plan.name}
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
                    Sign Up
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: '#3f4a61', ':hover': { borderColor: '#fff' } }}
                    onClick={() => navigate("/")}
                >
                    Already have an account? Log in
                </Button>
            </Box>
        </Container>
    );
}