import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card,
    CardContent, TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function UsagePage({ centralStock, onNavigate, onSubmitUsage, storeId }) {
    const [usage, setUsage] = useState({}); // { productId: quantity, ... }

    // Csak az alapanyagokat listázzuk
    const rawMaterials = centralStock.filter(p => p.inventoryType === 'RAW_MATERIAL');

    const handleQuantityChange = (productId, quantity) => {
        const numQuantity = Number(quantity);
        setUsage(prevUsage => ({
            ...prevUsage,
            [productId]: numQuantity,
        }));
    };

    const handleSubmit = () => {
        if (Object.values(usage).every(qty => qty <= 0)) {
            alert("Nincs megadva fogyás!");
            return;
        }
        onSubmitUsage(usage, storeId);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Fogyás Jelentése
                    </Typography>
                    <Button color="inherit" onClick={() => onNavigate('dashboard')}>&larr; Vissza</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Alapanyag Felhasználás
                </Typography>
                <Typography sx={{ mb: 3 }} color="text.secondary">
                    Add meg, hogy az egyes alapanyagokból mennyit használtál fel a mai napon.
                </Typography>
                <Grid container spacing={3}>
                    {rawMaterials.map(item => (
                        <Grid item key={item.id} xs={12} sm={6}>
                            <Card className="glass-card">
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography color="text.secondary">
                                            Készleten: {item.quantity} {item.unit}
                                        </Typography>
                                    </Box>
                                    <TextField
                                        type="number"
                                        label="Felhasznált"
                                        size="small"
                                        variant="outlined"
                                        value={usage[item.id] || ''}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        InputProps={{ inputProps: { min: 0, max: item.quantity } }}
                                        sx={{ width: '120px' }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        sx={{ background: '#4caf50', '&:hover': { background: '#388e3c' } }}
                    >
                        Fogyás Rögzítése
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default UsagePage;