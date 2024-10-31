import React, {useEffect, useState} from "react";
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid2';
import Swal from 'sweetalert2';

export default function Profile() {
    const [dataUser, setDataUser] = useState({})
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [country, setCountry] = useState('')
    const [nationality, setNationality] = useState('')
    const [phone, setPhone] = useState('')
    const [countries, setCountries] = useState([])
    const [changes, setChanges] = useState({})
    const navigate = useNavigate();

    const loadUser = () => {
        const user = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')) : undefined
        if (user) {
            setDataUser(user)
            const { NOMBRE, APELLIDO, EMAIL, USUARIO, NACIONALIDAD, PAIS_RESIDENCIA, CELULAR } = user
            setName(NOMBRE)
            setLastName(APELLIDO)
            setEmail(EMAIL)
            setUsername(USUARIO)
            setCountry(PAIS_RESIDENCIA)
            setNationality(NACIONALIDAD)
            setPhone(CELULAR)
            setChanges({})
        } else {
            navigate('/')
        }
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
        if(event.target.value !== dataUser.NOMBRE) {
            setChanges({ ...changes, NOMBRE: event.target.value })
        } else {
            const { NOMBRE, ...revert } = changes
            setChanges(revert)
        }
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        if(event.target.value !== dataUser.APELLIDO) {
            setChanges({ ...changes, APELLIDO: event.target.value })
        } else {
            const { APELLIDO, ...revert } = changes
            setChanges(revert)
        }
    }

    const handleCountryChange = (event) => {
        setCountry(event.target.value)
        const selectedCountry = countries.find(c => c.name === event.target.value)
        if(event.target.value !== dataUser.PAIS_RESIDENCIA) {
            setChanges({ ...changes, PAIS_RESIDENCIA: selectedCountry.id })
        } else {
            const { PAIS_RESIDENCIA, ...revert } = changes
            setChanges(revert)
        }
    }
    
    const handleNationalityChange = (event) => {
        setNationality(event.target.value)
        if(event.target.value !== dataUser.NACIONALIDAD) {
            setChanges({ ...changes, NACIONALIDAD: event.target.value })
        } else {
            const { NACIONALIDAD, ...revert } = changes
            setChanges(revert)
        }
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value)
        if(event.target.value !== dataUser.CELULAR) {
            setChanges({ ...changes, CELULAR: event.target.value })
        } else {
            const { CELULAR, ...revert } = changes
            setChanges(revert)
        }
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
    
    const update = async () => {
        if(Object.keys(changes).length > 0) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/uploadProfile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ID_USUARIO: dataUser.ID_USUARIO , changes })
                })
                if(response.ok) {
                    const data = await response.json()
                    //si el cambio fue en PAIS_RESIDENCIA, se busca el nombre del pais
                    if(changes.PAIS_RESIDENCIA) {
                        const selectedCountry = countries.find(c => c.id === changes.PAIS_RESIDENCIA)
                        changes.PAIS_RESIDENCIA = selectedCountry.name
                    }
                    localStorage.setItem('USUARIO', JSON.stringify({ ...dataUser, ...changes }))
                    loadUser()
                    Swal.fire({
                        icon: data.icon,
                        title: data.message,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    return
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to update profile!',
                    showConfirmButton: false,
                    timer: 2000
                });
            } catch(e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to update profile!',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        }
    }

    useEffect(() => {
        getCountries()
        loadUser()
    }, [])

    return (
        <Container
            component="main"
            maxWidth="100%"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                bgcolor: '#1e293a',
                p: 3,
                height: '100vh',
                position: 'relative'
            }}
        >
            <Box sx={{ flexGrow: 1 }} >
                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, md: 6, lg: 8 }}>
                        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Profile
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 2, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={username}
                            InputLabelProps={{ style: { color: '#ccc' } }}
                            InputProps={{ style: { color: '#fff' }, readOnly: true, }}
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
                            InputLabelProps={{ style: { color: '#ccc' } }}
                            InputProps={{ style: { color: '#fff' }, readOnly: true, }}
                            variant="outlined"
                            sx={{ bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                        />
                    </Box>

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
                        sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1, input: { color: 'white' } }}
                    />

                    <FormControl fullWidth sx={{ mt: 2, bgcolor: '#233044', borderRadius: 1 }}>
                        <InputLabel sx={{ color: '#ccc' }}>Country Of Residence</InputLabel>
                        <Select
                            value={country}
                            required
                            onChange={handleCountryChange}
                            label="Country Of Residence"
                            sx={{ color: '#fff' }}
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

                    <FormControl fullWidth sx={{ mt: 3, bgcolor: '#233044', borderRadius: 1 }}>
                        <InputLabel sx={{ color: '#ccc' }}>Nationality</InputLabel>
                        <Select
                            value={nationality}
                            required
                            onChange={handleNationalityChange}
                            label="Nationality"
                            sx={{ color: '#fff' }}
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

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: Object.keys(changes).length > 0 ? '#1e253a' : '#3f4a61', ':hover': { bgcolor: Object.keys(changes).length > 0 ? '#4e586e' : null } }}
                        onClick={update}
                    >
                        Update
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ color: '#fff', borderColor: '#3f4a61', ':hover': { borderColor: '#fff' } }}
                        onClick={loadUser}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}