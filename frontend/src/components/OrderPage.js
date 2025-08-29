import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    Box,
    Card,
    CardContent,
    TextField,
    Paper
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function OrderPage({ centralStock, onNavigate, onSubmitOrder }) {
    const [cart, setCart] = useState({});

    const handleQuantityChange = (productId, quantity) => {
        const newCart = { ...cart };
        const numQuantity = Number(quantity);
        if (numQuantity > 0) {
            newCart[productId] = numQuantity;
        } else {
            delete newCart[productId];
        }
        setCart(newCart);
    };

    const handleSubmit = () => {
        if (Object.keys(cart).length === 0) {
            alert("A kosár üres!");
            return;
        }
        onSubmitOrder(cart);
        setCart({});
    };
    
    const orderableProducts = centralStock.filter(p => p.inventoryType === 'FINISHED_GOOD');
    const totalItemsInCart = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    return (
        <Box sx={{ flexGrow: 1 }} className="partner-theme">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Rendelés Központból
                    </Typography>
                    <Button color="inherit" onClick={() => onNavigate('dashboard')}>&larr; Vissza</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, pb: '100px' }}>
                {/* A MUI Grid helyett egy Box komponenst használunk CSS Grid-del */}
                <Box sx={{
                    display: 'grid',
                    gap: 2,
                    // Reszponzív oszlopok:
                    // Alapból (mobilon) 2 oszlop
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    // Kis képernyőtől (sm) 3 oszlop
                    '@media (min-width:600px)': { 
                        gridTemplateColumns: 'repeat(3, 1fr)',
                    },
                    // Közepes képernyőtől (md) 4 oszlop
                    '@media (min-width:900px)': {
                        gridTemplateColumns: 'repeat(4, 1fr)',
                    },
                    // Nagy képernyőtől (lg) 5 oszlop
                    '@media (min-width:1200px)': {
                        gridTemplateColumns: 'repeat(5, 1fr)',
                    },
                }}>
                    {orderableProducts.map(item => (
                        // A Grid item-re már nincs szükség, a Card a rács elem
                        <Card key={item.id} className="glass-card" sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                                <Typography variant="h6" component="h2" sx={{ fontSize: '1rem' }}>
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem' }}>
                                    Készleten: {item.quantity} {item.unit}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 1 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Menny."
                                    variant="outlined"
                                    size="small"
                                    value={cart[item.id] || ''}
                                    onChange={e => handleQuantityChange(item.id, e.target.value)}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Box>
                        </Card>
                    ))}
                </Box>
            </Container>
            <Paper className="order-summary-bar" elevation={3}>
                <Typography variant="h6">
                    Kosár: <strong>{totalItemsInCart}</strong> db termék
                </Typography>
                <Button 
                    variant="contained" 
                    size="large" 
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleSubmit}
                    disabled={totalItemsInCart === 0}
                    sx={{
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        fontWeight: 'bold'
                    }}
                >
                    Rendelés
                </Button>
            </Paper>
        </Box>
    );
}

export default OrderPage;