import React, { useState } from 'react';

function StockAdjustment({ centralStock, onSubmit, onNavigate }) {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [notes, setNotes] = useState('');
    const [feedback, setFeedback] = useState({ message: '', error: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProductId) {
            setFeedback({ message: 'Válassz egy terméket a listából!', error: true });
            return;
        }
        try {
            await onSubmit({ productId: selectedProductId, quantity, notes });
            setFeedback({ message: 'Készletmódosítás sikeresen rögzítve!', error: false });
            setSelectedProductId('');
            setQuantity(0);
            setNotes('');
        } catch (error) {
            setFeedback({ message: `Hiba: ${error.message}`, error: true });
        }
    };

    return (
        <div className="bevetelezes-container">
            <h2>Kézi Készletmódosítás</h2>
            <form onSubmit={handleSubmit} className="controls-container">
                <select 
                    value={selectedProductId} 
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '1.1em', width: '100%', maxWidth: '300px' }}
                >
                    <option value="" disabled>Válassz egy terméket...</option>
                    {centralStock.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name} (Készleten: {product.quantity})
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Mennyiség (pozitív vagy negatív)"
                    required
                    style={{ padding: '10px', fontSize: '1.1em', width: '200px', textAlign: 'center' }}
                />
                
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Módosítás oka (pl. leltár, kézi bevét)..."
                    rows="3"
                    style={{ width: '100%', maxWidth: '300px', padding: '10px' }}
                />

                <button type="submit">Készlet Módosítása</button>

                {feedback.message && (
                    <p className={feedback.error ? 'feedback-error' : 'feedback-success'}>
                        {feedback.message}
                    </p>
                )}
            </form>
            <button onClick={() => onNavigate('dashboard')} style={{ marginTop: '20px' }}>Vissza a vezérlőpultra</button>
        </div>
    );
}

export default StockAdjustment;