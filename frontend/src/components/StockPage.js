import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Card,
    CardContent, CardActions, TextField, IconButton, Tooltip, Grid
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckIcon from '@mui/icons-material/Check';

// Egyetlen termékkártya komponens
function StockItemCard({ item, onMove, onUse, onMoveBack, onLogUsage }) {
    const [moveQuantity, setMoveQuantity] = useState(1);
    const [usageQuantity, setUsageQuantity] = useState('');

    const getStockStatusClass = () => {
        if (item.quantity === 0) return 'stock-card-out';
        if (item.quantity <= 5) return 'stock-card-low';
        return 'stock-card-sufficient';
    };

    return (
        <Card className={`glass-card stock-card ${getStockStatusClass()}`} sx={{ mb: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
                <Typography variant="h6" component="div">{item.name}</Typography>
                <Typography color="text.secondary">Készleten: {item.quantity} {item.unit || 'db'}</Typography>
            </CardContent>
            <CardActions sx={{ 
                flexDirection: 'column', 
                alignItems: 'stretch',
                gap: 1, 
                p: 2, 
                pt: 0 
            }}>
                {onMove && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            type="number"
                            size="small"
                            variant="outlined"
                            value={moveQuantity}
                            onChange={(e) => setMoveQuantity(e.target.value)}
                            InputProps={{ inputProps: { min: 1, max: item.quantity } }}
                            sx={{ flexGrow: 1 }}
                        />
                        <Tooltip title="Áthelyezés a pultba">
                            <Button variant="contained" onClick={() => onMove(item, moveQuantity)} sx={{ minWidth: 'auto', p: '8px' }}>
                                <ArrowForwardIosIcon />
                            </Button>
                        </Tooltip>
                    </Box>
                )}
                {onUse && (
                    <Button 
                        variant="contained" 
                        color="error" 
                        startIcon={<DeleteSweepIcon />}
                        onClick={() => onUse(item.id)}
                    >
                        Felhasználva (nullázás)
                    </Button>
                )}
                {onMoveBack && (
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        startIcon={<ReplayIcon />}
                        onClick={() => onMoveBack(item.id)}
                    >
                        Vissza a fagyasztóba
                    </Button>
                )}
                {onLogUsage && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            type="number"
                            label="Felhasznált"
                            size="small"
                            variant="outlined"
                            value={usageQuantity}
                            onChange={(e) => setUsageQuantity(e.target.value)}
                            InputProps={{ inputProps: { min: 1, max: item.quantity } }}
                            sx={{ flexGrow: 1 }}
                        />
                        <Tooltip title="Felhasználás naplózása">
                            <Button variant="contained" color="success" onClick={() => onLogUsage(item.productId, usageQuantity)} sx={{ minWidth: 'auto', p: '8px' }}>
                                <CheckIcon />
                            </Button>
                        </Tooltip>
                    </Box>
                )}
            </CardActions>
        </Card>
    );
}

// A fő oldal komponens
function StockPage({ storeId, storeStock, onNavigate, onMoveToCounter, onUseFromCounter, onMoveFromCounterToBack, onLogUsage }) {
    const finishedGoods = storeStock.filter(item => item.storeId === storeId && (item.inventoryType === 'FINISHED_GOOD' || !item.inventoryType));
    const rawMaterials = storeStock.filter(item => item.storeId === storeId && item.inventoryType === 'RAW_MATERIAL');

    const backFreezer = finishedGoods.filter(item => item.stockType === 'backFreezer' && item.quantity > 0);
    const counter = finishedGoods.filter(item => item.stockType === 'pult' && item.quantity > 0);

    const handleMove = (item, quantity) => {
        const qty = parseInt(quantity, 10);
        if (qty > 0 && qty <= item.quantity) {
            onMoveToCounter(item.productId, qty);
        } else if (qty > item.quantity) {
            alert("Nincs ennyi a raktárban!");
        } else {
            alert("Érvénytelen mennyiség.");
        }
    };

    const handleMoveBack = (storeStockId) => {
        const item = storeStock.find(i => i.id === storeStockId);
        if (!item) return;
        const qty = parseInt(prompt(`Mennyit szeretnél visszaküldeni a raktárba a(z) '${item.name}' termékből? (Max: ${item.quantity})`, "1"), 10);
        if (qty > 0 && qty <= item.quantity) {
            onMoveFromCounterToBack(storeStockId, qty);
        } else if (qty > item.quantity) {
            alert("Nincs ennyi a pultban!");
        }
    };
    
    const handleLogUsageSubmit = (productId, quantity) => {
        const qty = parseInt(quantity, 10);
        if (qty > 0) {
            onLogUsage({ [productId]: qty }, storeId);
        } else {
            alert("Érvénytelen mennyiség.");
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Készlet: {storeId.toUpperCase()}
                    </Typography>
                    <Button color="inherit" onClick={() => onNavigate('stores')}>&larr; Vissza a boltokhoz</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <div className="stock-column">
                            <Typography variant="h5" component="h2" gutterBottom>Hátsó Fagyasztó</Typography>
                            {backFreezer.length > 0 ? backFreezer.map(item => ( <StockItemCard key={item.id} item={item} onMove={handleMove} /> )) : <Typography>A raktár üres.</Typography>}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className="stock-column">
                            <Typography variant="h5" component="h2" gutterBottom>Pult</Typography>
                            {counter.length > 0 ? counter.map(item => ( <StockItemCard key={item.id} item={item} onUse={onUseFromCounter} onMoveBack={handleMoveBack} /> )) : <Typography>A pult üres.</Typography>}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className="stock-column">
                            <Typography variant="h5" component="h2" gutterBottom>Alapanyagok</Typography>
                            {rawMaterials.length > 0 ? rawMaterials.map(item => ( <StockItemCard key={item.id} item={item} onLogUsage={handleLogUsageSubmit} /> )) : <Typography>Nincsenek alapanyagok.</Typography>}
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default StockPage;