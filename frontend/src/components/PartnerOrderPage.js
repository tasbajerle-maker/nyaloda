import React, { useState } from 'react';

function PartnerOrderPage({ centralStock, onNavigate, onSubmitOrder }) {
    const [cart, setCart] = useState({});

    // Kiszűrjük azokat a termékeket, amik a partnerek számára láthatóak
    const orderableProducts = centralStock.filter(item => item.isPartnerVisible && item.type === 'finished');

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
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Új Rendelés</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza a portálra</button>
            </header>
            <main>
                <h3>Rendelhető Termékek</h3>
                <ul className="order-list">
                    {orderableProducts.length > 0 ? orderableProducts.map(item => (
                        <li key={item.id} className="order-item">
                            <span>{item.name} ({item.unit})</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={cart[item.id] || ''}
                                onChange={e => handleQuantityChange(item.id, e.target.value)}
                                className="quantity-input"
                            />
                        </li>
                    )) : <li>Jelenleg nincsenek rendelhető termékek.</li>}
                </ul>
                <button onClick={handleSubmit} className="submit-order-btn">
                    Rendelés Leadása ({Object.keys(cart).length} tétel)
                </button>
            </main>
        </div>
    );
}

export default PartnerOrderPage;