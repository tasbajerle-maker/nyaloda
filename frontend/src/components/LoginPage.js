import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Alert,
    CircularProgress // Betöltés jelző
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Egyedi stílus a háttérhez (palota bejárata)
const BackgroundBox = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)', // Lágyabb színátmenet
}));

function LoginPage({ onLogin, errorMessage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Betöltés állapot kezelése

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Betöltés elindítása
        try {
            await onLogin(email, password);
        } finally {
            setLoading(false); // Betöltés befejezése
        }
    };

    return (
        <BackgroundBox>
            <Container component="main" maxWidth="xs">
                <Card sx={{ mt: 8, boxShadow: 6, borderRadius: 3 }}> {/* Kártya árnyék és lekerekített sarkok */}
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4, // Vertikális padding
                            }}
                        >
                            <img src="https://via.placeholder.com/60" alt="Logo" style={{ marginBottom: '16px' }} /> {/* Logó placeholder */}
                            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                                Kérjük jelentkezzen be
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email cím"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Jelszó"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
                                />
                                {errorMessage && (
                                    <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
                                        {errorMessage}
                                    </Alert>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, py: 1.5 }} // Nagyobb gomb
                                    disabled={loading} // Gomb kikapcsolása betöltés alatt
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Bejelentkezés'}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </BackgroundBox>
    );
}

export default LoginPage;