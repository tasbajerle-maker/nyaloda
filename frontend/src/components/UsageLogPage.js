import React, { useState } from 'react';

function UsageLogPage({ storeStock, currentStoreId, onNavigate, onLogUsage }) {
    const [usage, setUsage] = useState({});

    // Csak a pultban lévő, készleten lévő termékeket listázzuk
    const pultStock = storeStock.filter(item => 
        item.storeId === currentStoreId && 
        item.stockType === 'pult' && 
        item.quantity > 0
    );

    const handleUsageChange = (productId, quantity) => {
        const newUsage = { ...usage };
        const numQuantity = Number(quantity);
        if (numQuantity > 0) {
            newUsage[productId] = numQuantity;
        } else {
            delete newUsage[productId];
        }
        setUsage(newUsage);
    };
    
    const handleSubmit = () => {
        if (Object.keys(usage).length === 0) {
            alert("Nem adott meg fogyást.");
            return;
        }
        onLogUsage(usage);
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Fogyás Jelentése ({currentStoreId})</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza</button>
            </header>
            <main>
                <div className="usage-list">
                    {pultStock.length > 0 ? pultStock.map(item => (
                        <div key={item.id} className="input-group">
                            <label>{item.name} (Pultban: {item.quantity})</label>
                            <input
                                type="number"
                                min="0"
                                max={item.quantity}
                                placeholder="0"
                                value={usage[item.productId] || ''}
                                onChange={e => handleUsageChange(item.productId, e.target.value)}
                            />
                        </div>
                    )) : <p>A pult üres, nincs mit naplózni.</p>}
                </div>
                {pultStock.length > 0 && (
                    <button onClick={handleSubmit} className="submit-order-btn">Fogyás Naplózása</button>
                )}
            </main>
        </div>
    );
}

export default UsageLogPage;