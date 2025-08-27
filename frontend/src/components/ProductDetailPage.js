import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Card, CardContent, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { generatePdfForDatasheet } from '../utils/pdfGenerator';

function ProductDetailPage({ product, onNavigate, onUpdateProduct }) {
    const [formData, setFormData] = useState(product);

    useEffect(() => {
        // Biztosítjuk, hogy a form adatai frissüljenek, ha a prop-ként kapott termék változik
        setFormData(product);
    }, [product]);

    // Ha a termék még nem töltődött be, ne jelenítsünk meg semmit, vagy egy töltő ikont
    if (!product) {
        return <div>Termék betöltése...</div>;
    }
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = { ...formData, quantity: Number(formData.quantity) };
        onUpdateProduct(product.id, dataToSubmit);
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Termék Szerkesztése: {product.name}</h2>
                <button onClick={() => onNavigate('admin')}>&larr; Vissza az Adatkezeléshez</button>
            </header>
            <main style={{ padding: '2rem' }}>
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Termék neve" name="name" value={formData.name} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Vonalkód" name="barcode" value={formData.barcode || ''} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField fullWidth label="Mennyiség" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth><InputLabel>Egység</InputLabel><Select name="unit" label="Egység" value={formData.unit} onChange={handleChange}><MenuItem value="tégely">tégely</MenuItem><MenuItem value="kg">kg</MenuItem><MenuItem value="db">db</MenuItem></Select></FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth><InputLabel>Típus</InputLabel><Select name="type" label="Típus" value={formData.type} onChange={handleChange}><MenuItem value="finished">Késztermék</MenuItem><MenuItem value="raw">Alapanyag</MenuItem></Select></FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Gyártási lap / Adatlap" name="datasheet" multiline rows={6} value={formData.datasheet || ''} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox name="isPartnerVisible" checked={formData.isPartnerVisible || false} onChange={handleChange} />}
                                        label="Látható a partnerek számára"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Mentés</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" size="large" fullWidth onClick={() => generatePdfForDatasheet(formData)}>Nyomtatás (PDF)</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default ProductDetailPage;