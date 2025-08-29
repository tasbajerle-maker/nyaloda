import React, { useMemo } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, unit }) => (
    <Paper className="stat-card" elevation={3}>
        <Typography color="text.secondary" gutterBottom>{title}</Typography>
        <Typography variant="h4" component="div">
            {value} <span style={{ fontSize: '0.8rem' }}>{unit}</span>
        </Typography>
    </Paper>
);

function ReportsPage({ stockMovements, allUsers, centralStock, onNavigate }) {
    const reportData = useMemo(() => {
        if (!stockMovements || stockMovements.length === 0) {
            return { topWastedProduct: 'N/A', totalMovements: 0, chartData: { labels: [], datasets: [] }, detailedLogs: [] };
        }

        const userMap = new Map(allUsers.map(u => [u.id, u.name || u.email]));
        const productMap = new Map(centralStock.map(p => [p.id, p.name]));
        const usageAndWaste = stockMovements.filter(m => m.type === 'USAGE' || m.type === 'WASTE' || m.type === 'SALE');

        const aggregated = usageAndWaste.reduce((acc, log) => {
            const productName = productMap.get(log.product) || 'Ismeretlen termék';
            acc[productName] = (acc[productName] || 0) + Math.abs(log.quantity);
            return acc;
        }, {});

        const sorted = Object.entries(aggregated).sort(([, a], [, b]) => b - a);
        const topProduct = sorted.length > 0 ? sorted[0][0] : 'N/A';
        const totalMovements = stockMovements.length;

        const chartData = {
            labels: sorted.slice(0, 10).map(item => item[0]),
            datasets: [{
                label: 'Fogyás és Selejt (db)',
                data: sorted.slice(0, 10).map(item => item[1]),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }],
        };

        const detailedLogs = stockMovements.map(log => ({
            ...log,
            productName: productMap.get(log.product) || 'Ismeretlen',
            userName: userMap.get(log.user) || 'Ismeretlen',
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return { topProduct, totalMovements, chartData, detailedLogs };
    }, [stockMovements, allUsers, centralStock]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Jelentések
                    </Typography>
                    <Button color="inherit" onClick={() => onNavigate('dashboard')}>&larr; Vissza</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <StatCard title="Legtöbb Fogyás/Selejt" value={reportData.topProduct} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatCard title="Összes Raktári Mozgás" value={reportData.totalMovements} unit="db" />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className="glass-card" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Top 10 Fogyás és Selejt</Typography>
                            {reportData.detailedLogs.length > 0 ? <Bar data={reportData.chartData} /> : <Typography>Nincs adat a grafikonhoz.</Typography>}
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                         <TableContainer component={Paper} className="reports-table-container">
                            <Table sx={{ minWidth: 650 }} aria-label="mozgási napló">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dátum</TableCell>
                                        <TableCell>Típus</TableCell>
                                        <TableCell>Termék</TableCell>
                                        <TableCell>Mennyiség</TableCell>
                                        <TableCell>Felhasználó</TableCell>
                                        <TableCell>Bolt</TableCell>
                                        <TableCell>Megjegyzés</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportData.detailedLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{new Date(log.createdAt).toLocaleString('hu-HU')}</TableCell>
                                            <TableCell><Chip label={log.type} size="small" /></TableCell>
                                            <TableCell>{log.productName}</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: log.quantity > 0 ? 'green' : 'red' }}>
                                                {log.quantity}
                                            </TableCell>
                                            <TableCell>{log.userName}</TableCell>
                                            <TableCell>{log.store}</TableCell>
                                            <TableCell>{log.notes}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ReportsPage;