import React, { useState } from 'react';

// Ez a komponens megkapja az összes terméket (centralStock),
// és két funkciót, amivel kommunikál (onSubmit, onNavigate).
function Selejtezes({ centralStock, onSubmit, onNavigate }) {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [feedback, setFeedback] = useState({ message: '', error: false });

    const handleSubmit = async (e) => {
        e.preventDefault(); // Megakadályozza az oldal újratöltődését
        if (!selectedProductId) {
            setFeedback({ message: 'Válassz egy terméket a listából!', error: true });
            return;
        }
        try {
            // Meghívjuk az App.js-től kapott onSubmit funkciót
            await onSubmit({ productId: selectedProductId, quantity, notes });
            setFeedback({ message: 'Selejtezés sikeresen rögzítve!', error: false });
            // Sikeres mentés után ürítjük a formot
            setSelectedProductId('');
            setQuantity(1);
            setNotes('');
        } catch (error) {
            setFeedback({ message: `Hiba: ${error.message}`, error: true });
        }
    };

    return (
        <div className="bevetelezes-container"> {/* Újrahasznosítjuk a régi stílust */}
            <h2>Termék Selejtezése</h2>
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
                    placeholder="Mennyiség"
                    min="1"
                    required
                />
                
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Selejtezés oka (pl. lejárt, sérült)..."
                    rows="3"
                    style={{ width: '100%', maxWidth: '300px', padding: '10px' }}
                />

                <button type="submit">Selejtezés</button>

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

export default Selejtezes;