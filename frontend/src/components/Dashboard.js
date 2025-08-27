import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    Grid, 
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function StoreSwitcher({ user, currentStoreId, onStoreChange }) {
    if (!user.storeIds || user.storeIds.length < 1) {
        return null;
    }
    if (user.storeIds.length === 1) {
        return <Typography sx={{ mr: 2 }}>Bolt: {currentStoreId ? currentStoreId.toUpperCase() : ''}</Typography>;
    }
    return (
        <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel id="store-select-label" sx={{ color: 'white' }}>Aktuális Bolt</InputLabel>
            <Select
                labelId="store-select-label"
                value={currentStoreId || ''}
                onChange={e => onStoreChange(e.target.value)}
                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
            >
                {user.storeIds.map(id => (
                    <MenuItem key={id} value={id}>{id.toUpperCase()}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function Dashboard({ user, onNavigate, onLogout, currentStoreId, onStoreChange }) {
    const isManager = user.role === 'manager';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Nyaloda Irányítópult
                    </Typography>
                    {isManager ? null : <StoreSwitcher user={user} currentStoreId={currentStoreId} onStoreChange={onStoreChange} />}
                    <Typography sx={{ mr: 2 }}>{user.email}</Typography>
                    <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
                        Kijelentkezés
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="contained" size="large" onClick={() => onNavigate('checklist')}>Napi Küldetés</Button></Grid>
                    <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="contained" size="large" onClick={() => onNavigate('stores')}>Bolti Készlet</Button></Grid>
                    <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="contained" size="large" onClick={() => onNavigate('usage')}>Fogyás Jelentése</Button></Grid>
                    <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="contained" size="large" onClick={() => onNavigate('order')}>Rendelés Központból</Button></Grid>
                    {isManager && (
                        <>
                            <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" size="large" onClick={() => onNavigate('orderAdmin')}>Rendelések Kezelése</Button></Grid>
                            <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" size="large" onClick={() => onNavigate('admin')}>Adatkezelés</Button></Grid>
                            <Grid item xs={12} sm={6} md={3}><Button fullWidth variant="outlined" size="large" onClick={() => onNavigate('reports')}>Jelentések</Button></Grid>
                        </>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}

export default Dashboard;