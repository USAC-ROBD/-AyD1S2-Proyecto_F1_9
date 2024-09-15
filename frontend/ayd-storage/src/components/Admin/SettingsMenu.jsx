import React, { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import CreateAccount from './CreateAccount/CreateAccount';
import ModifySettings from './ModifySettings/ModifySettings';

export default function SettingsMenu() {
    const [activeComponent, setActiveComponent] = useState(null);

    const handleGoBack = () => setActiveComponent(null);

    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                bgcolor: '#1e293a',
                p: 3,
            }}
        >
            {!activeComponent && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setActiveComponent('create')}
                        sx={{ bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                    >
                        Create Account
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setActiveComponent('modify')}
                        sx={{ bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
                    >
                        Modify Settings
                    </Button>
                </Box>
            )}

            {activeComponent === 'create' && (
                <Box sx={{ width: '100%' }}>
                    <CreateAccount />
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoBack}
                        sx={{ mt: 2, color: '#fff', borderColor: '#3f4a61', ':hover': { borderColor: '#fff' } }}
                    >
                        Go Back
                    </Button>
                </Box>
            )}

            {activeComponent === 'modify' && (
                <Box sx={{ width: '100%' }}>
                    <ModifySettings />
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoBack}
                        sx={{ mt: 2, color: '#fff', borderColor: '#3f4a61', ':hover': { borderColor: '#fff' } }}
                    >
                        Go Back
                    </Button>
                </Box>
            )}
        </Container>
    );
}
