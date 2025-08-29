import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    Grid, 
    Box 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';

function PartnerDashboard({ user, onNavigate, onLogout }) {
    return (
        // A 'partner-theme' osztály aktiválja az új lila-kék stílust a CSS-ből
        <Box sx={{ flexGrow: 1 }} className="partner-theme">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Partner Portál
                    </Typography>
                    <Typography sx={{ mr: 2 }}>{user.email}</Typography>
                    <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
                        Kijelentkezés
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => onNavigate('partnerOrder')}
                            sx={{ 
                                height: '100px',
                                background: 'linear-gradient(45deg, #4f46e5 30%, #06b6d4 90%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            Új Rendelés
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            startIcon={<HistoryIcon />}
                            onClick={() => onNavigate('partnerOrders')}
                            sx={{ 
                                height: '100px',
                                background: 'linear-gradient(45deg, #4f46e5 30%, #06b6d4 90%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            Rendeléseim
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default PartnerDashboard;