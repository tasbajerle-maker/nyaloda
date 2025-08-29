import React, { useState } from 'react';
import { 
    Button, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Typography, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Box,
    Container 
} from '@mui/material';

// --- Belső komponens a termékek kezeléséhez ---
const ProductAdmin = ({ centralStock, onNavigate, onCreateProduct, onToggleVisibility }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(10);
    const [unit, setUnit] = useState('tégely');
    const [inventoryType, setInventoryType] = useState('FINISHED_GOOD');

    const handleCreate = (e) => {
        e.preventDefault();
        onCreateProduct({ name, quantity: Number(quantity), unit, inventoryType });
        setName('');
        setQuantity(10);
    };
    
    const finishedProducts = centralStock.filter(p => p.inventoryType === 'FINISHED_GOOD');
    const rawMaterials = centralStock.filter(p => p.inventoryType === 'RAW_MATERIAL');

    return (
        <Box>
            <Card sx={{ mb: 4, background: 'rgba(255,255,255,0.05)' }}>
                <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>Új Termék Felvitele</Typography>
                    <form onSubmit={handleCreate}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}><TextField fullWidth size="small" label="Termék neve" value={name} onChange={e => setName(e.target.value)} required /></Grid>
                            <Grid item xs={6} sm={2}><TextField fullWidth size="small" label="Mennyiség" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} /></Grid>
                            <Grid item xs={6} sm={2}><FormControl fullWidth size="small"><InputLabel>Egység</InputLabel><Select value={unit} label="Egység" onChange={e => setUnit(e.target.value)}><MenuItem value="tégely">tégely</MenuItem><MenuItem value="kg">kg</MenuItem><MenuItem value="db">db</MenuItem></Select></FormControl></Grid>
                            <Grid item xs={6} sm={2}><FormControl fullWidth size="small"><InputLabel>Kategória</InputLabel><Select value={inventoryType} label="Kategória" onChange={e => setInventoryType(e.target.value)}><MenuItem value="FINISHED_GOOD">Késztermék</MenuItem><MenuItem value="RAW_MATERIAL">Alapanyag</MenuItem></Select></FormControl></Grid>
                            <Grid item xs={12} sm={2}><Button type="submit" variant="contained" fullWidth>Létrehozás</Button></Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Typography variant="h5" component="h2" gutterBottom>Késztermékek</Typography>
            <Grid container spacing={3}>
                {finishedProducts.map(p => (
                    <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                        <Card className="glass-card">
                            <CardContent>
                                <Typography variant="h6">{p.name}</Typography>
                                <Typography className="MuiTypography-colorTextSecondary">{p.quantity} {p.unit}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => onNavigate('productDetail', p.id)}>Szerkesztés / Adatlap</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>Alapanyagok</Typography>
            <Grid container spacing={3}>
                 {rawMaterials.map(p => (
                    <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                        <Card className="glass-card">
                            <CardContent>
                                <Typography variant="h6">{p.name}</Typography>
                                <Typography className="MuiTypography-colorTextSecondary">{p.quantity} {p.unit}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => onNavigate('productDetail', p.id)}>Szerkesztés / Adatlap</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

// --- Belső komponens a felhasználók kezeléséhez ---
const UserAdmin = ({ allUsers, onCreateUser, onDeleteUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');

    const handleCreate = (e) => {
        e.preventDefault();
        onCreateUser({ email, password, role });
        setEmail('');
        setPassword('');
    };

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" component="h3" gutterBottom>Új Felhasználó</Typography>
                <form onSubmit={handleCreate}>
                    <TextField type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required sx={{ mb: 2 }}/>
                    <TextField type="password" label="Jelszó" value={password} onChange={e => setPassword(e.target.value)} fullWidth required sx={{ mb: 2 }}/>
                    <FormControl fullWidth>
                        <InputLabel>Szerepkör</InputLabel>
                        <Select value={role} label="Szerepkör" onChange={e => setRole(e.target.value)}>
                            <MenuItem value="employee">Alkalmazott</MenuItem>
                            <MenuItem value="partner">Partner</MenuItem>
                            <MenuItem value="manager">Manager</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Létrehozás</Button>
                </form>
            </Grid>
            <Grid item xs={12} md={8}>
                <Typography variant="h6" component="h3" gutterBottom>Jelenlegi Felhasználók</Typography>
                <ul className="user-list">
                    {allUsers.map(u => (
                        <li key={u.id}>
                            <span>{u.email} ({u.role})</span>
                            {u.role !== 'manager' && 
                                <Button color="secondary" onClick={() => onDeleteUser(u.id)}>Törlés</Button>
                            }
                        </li>
                    ))}
                </ul>
            </Grid>
        </Grid>
    );
};

// --- Belső komponens a feladatok kezeléséhez ---
const TaskAdmin = ({ allTasks, onCreateTask, onDeleteTask }) => {
    const [text, setText] = useState('');
    const handleCreate = (e) => {
        e.preventDefault();
        onCreateTask({ text });
        setText('');
    };

    return (
        <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" component="h3" gutterBottom>Új Napi Feladat</Typography>
                <form onSubmit={handleCreate}>
                    <TextField label="Feladat leírása" value={text} onChange={e => setText(e.target.value)} fullWidth required />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Hozzáadás</Button>
                </form>
            </Grid>
            <Grid item xs={12} md={8}>
            <Typography variant="h6" component="h3" gutterBottom>Jelenlegi Feladatok</Typography>
                <ul className="task-list">
                    {allTasks.map(t => (
                        <li key={t.id}>
                            <span>{t.text}</span>
                            <Button color="secondary" onClick={() => onDeleteTask(t.id)}>Törlés</Button>
                        </li>
                    ))}
                </ul>
            </Grid>
        </Grid>
    );
};

// --- Belső komponens a raktárkezeléshez ---
const StockManagementAdmin = ({ onNavigate }) => {
    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Raktárkezelési Műveletek</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth variant="contained" size="large" onClick={() => onNavigate('bevetelezes')}>
                        Új Bevételezés (Vonalkódos)
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth variant="contained" size="large" onClick={() => onNavigate('waste')}>
                        Új Selejtezés
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Button fullWidth variant="contained" size="large" onClick={() => onNavigate('adjust-stock')}>
                        Kézi Készletmódosítás
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

// --- A Fő Komponens ---
function AdminPage({ centralStock, allUsers, allTasks, onNavigate, onCreateProduct, onToggleVisibility, onCreateUser, onDeleteUser, onCreateTask, onDeleteTask }) {
    const [view, setView] = useState('products');

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Adatkezelés</h2>
                <Button variant="outlined" onClick={() => onNavigate('dashboard')} sx={{ color: 'white', borderColor: 'white' }}>&larr; Vissza</Button>
            </header>
            <Container sx={{ py: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Grid container>
                        <Button variant={view === 'products' ? 'contained' : 'text'} onClick={() => setView('products')}>Termékek</Button>
                        <Button variant={view === 'users' ? 'contained' : 'text'} onClick={() => setView('users')}>Felhasználók</Button>
                        <Button variant={view === 'tasks' ? 'contained' : 'text'} onClick={() => setView('tasks')}>Napi Feladatok</Button>
                        <Button variant={view === 'stock' ? 'contained' : 'text'} onClick={() => setView('stock')}>Raktárkezelés</Button>
                    </Grid>
                </Box>
                
                {view === 'products' && <ProductAdmin centralStock={centralStock} onNavigate={onNavigate} onCreateProduct={onCreateProduct} onToggleVisibility={onToggleVisibility} />}
                {view === 'users' && <UserAdmin allUsers={allUsers} onCreateUser={onCreateUser} onDeleteUser={onDeleteUser} />}
                {view === 'tasks' && <TaskAdmin allTasks={allTasks} onCreateTask={onCreateTask} onDeleteTask={onDeleteTask} />}
                {view === 'stock' && <StockManagementAdmin onNavigate={onNavigate} />}
            </Container>
        </div>
    );
}

export default AdminPage;