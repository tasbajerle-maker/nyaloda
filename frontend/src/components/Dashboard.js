import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Select, MenuItem, FormControl, InputLabel,
    List, ListItem, ListItemText, Paper
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getDailyMessage } from '../utils/messages';

function StoreSwitcher({ user, currentStoreId, onStoreChange }) {
    if (!user.storeIds || user.storeIds.length < 1) { return null; }
    if (user.storeIds.length === 1) { return <Typography sx={{ mr: 2, color: 'white' }}>Bolt: {currentStoreId ? currentStoreId.toUpperCase() : ''}</Typography>; }
    return (
        <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
            <InputLabel id="store-select-label" sx={{ color: 'white' }}>Aktuális Bolt</InputLabel>
            <Select
                labelId="store-select-label"
                value={currentStoreId || ''}
                onChange={e => onStoreChange(e.target.value)}
                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
            >
                {user.storeIds.map(id => ( <MenuItem key={id} value={id}>{id.toUpperCase()}</MenuItem> ))}
            </Select>
        </FormControl>
    );
}

const DailyMessage = () => {
    const [message, setMessage] = useState('');
    useEffect(() => { setMessage(getDailyMessage()); }, []);
    if (!message) return null;
    return ( <Box className="daily-message-bubble"><Typography variant="body1">"{message}"</Typography></Box> );
};

function IncomingOrders({ orders, onReceiveOrder }) {
    if (orders.length === 0) { return null; }
    return (
        <Paper sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Bejövő Szállítmányok
            </Typography>
            <List>
                {orders.map(order => (
                    <ListItem
                        key={order.id}
                        secondaryAction={
                            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => onReceiveOrder(order.id)}>Átvétel</Button>
                        }
                    >
                        <ListItemText
                            primary={`Rendelés: ${order.orderId || order.id}`}
                            secondary={`Dátum: ${new Date(order.date).toLocaleDateString('hu-HU')}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

function Dashboard({ user, allOrders, onNavigate, onLogout, currentStoreId, onStoreChange, onReceiveOrder }) {
    const isManager = user.role === 'manager';

    const incomingOrdersForStore = isManager ? [] : (allOrders || []).filter(order => 
        order.storeId === currentStoreId && order.status === 'approved'
    );

    const palePurpleButtonSx = {
        backgroundColor: '#B19CD9',
        color: 'white',
        fontWeight: 'bold',
        padding: '16px 8px',
        textAlign: 'center',
        height: '100%',
        '&:hover': {
            backgroundColor: '#9A86B4'
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ background: 'linear-gradient(90deg, rgba(129,140,248,0.85) 0%, rgba(179,156,217,0.85) 100%)' }}>
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
                <Box sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
                }}>
                    <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('checklist')}>Napi Küldetés</Button>
                    <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('stores')}>Bolti Készlet</Button>
                    <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('usage')}>Fogyás Jelentése</Button>
                    <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('order')}>Rendelés Központból</Button>
                    {isManager && (
                        <>
                            <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('orderAdmin')}>Rendelések Kezelése</Button>
                            <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('admin')}>Adatkezelés</Button>
                            <Button variant="contained" sx={palePurpleButtonSx} onClick={() => onNavigate('reports')}>Jelentések</Button>
                        </>
                    )}
                </Box>
                
                <IncomingOrders orders={incomingOrdersForStore} onReceiveOrder={onReceiveOrder} />
                <DailyMessage />
            </Container>
        </Box>
    );
}

export default Dashboard;