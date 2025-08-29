import React, { useState } from 'react';
import { generatePdfForOrder } from '../utils/pdfGenerator';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent,
    CardActions, Collapse, IconButton, Chip, List, ListItem, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

// Egyedi, forgó "lenyitás" ikon
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

// Státuszokhoz tartozó színek és címkék
const statusMap = {
    pending: { label: 'Függőben', color: 'warning' },
    approved: { label: 'Jóváhagyva', color: 'info' },
    completed: { label: 'Teljesítve', color: 'success' },
    rejected: { label: 'Elutasítva', color: 'error' },
};

// Egyetlen rendelési kártya komponens
function OrderCard({ order, centralStock, onApproveOrder, onRejectOrder }) {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => setExpanded(!expanded);

    return (
        <Card className="glass-card">
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="div">
                        {order.owner}
                    </Typography>
                    <Chip
                        label={statusMap[order.status]?.label || order.status.toUpperCase()}
                        color={statusMap[order.status]?.color || 'default'}
                        size="small"
                    />
                </Box>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {new Date(order.date).toLocaleDateString('hu-HU')}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {/* CSAK A MANAGER MŰVELETEK MARADNAK */}
                {order.status === 'pending' && (
                    <>
                        <Button size="small" color="success" onClick={() => onApproveOrder(order.id)}>Jóváhagyás</Button>
                        <Button size="small" color="error" onClick={() => onRejectOrder(order.id)}>Elutasítás</Button>
                    </>
                )}
                <Button size="small" onClick={() => generatePdfForOrder(order, centralStock)}>PDF</Button>
                <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Rendelt tételek:</Typography>
                    <List dense className="order-details-list">
                        {Object.entries(order.items).map(([name, qty]) => (
                            <ListItem key={name}>
                                <ListItemText primary={`${name}: ${qty}`} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Collapse>
        </Card>
    );
}


// A fő oldal komponens
function OrderAdminPage({ allOrders, centralStock, onNavigate, onApproveOrder, onReceiveOrder, onRejectOrder }) {
    const [showArchived, setShowArchived] = useState(false);

    const activeOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'approved');
    const archivedOrders = allOrders.filter(o => o.status === 'completed' || o.status === 'rejected');
    const ordersToShow = showArchived ? archivedOrders : activeOrders;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Rendelések Kezelése
                    </Typography>
                    <Button color="inherit" onClick={() => onNavigate('dashboard')}>&larr; Vissza</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => setShowArchived(!showArchived)}>
                        {showArchived ? 'Aktív Rendelések Mutatása' : 'Archívum Mutatása'}
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {ordersToShow.map(order => (
                        <Grid item key={order.id} xs={12} md={6} lg={4}>
                            <OrderCard
                                order={order}
                                centralStock={centralStock}
                                onApproveOrder={onApproveOrder}
                                onRejectOrder={onRejectOrder}
                                // Az onReceiveOrder-t már nem adjuk át a kártyának, mert a gombot töröltük
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default OrderAdminPage;