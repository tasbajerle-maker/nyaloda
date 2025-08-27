import React, { useState } from 'react';

function OrderPage({ centralStock, onNavigate, onSubmitOrder }) {
    const [cart, setCart] = useState({});

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
                <h2>Rendelés Központból</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza</button>
            </header>
            <main>
                <h3>Rendelhető Termékek</h3>
                <ul className="order-list">
                    {centralStock.map(item => (
                        <li key={item.id} className="order-item">
                            <span>{item.name} (Készleten: {item.quantity} {item.unit})</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={cart[item.id] || ''}
                                onChange={e => handleQuantityChange(item.id, e.target.value)}
                                className="quantity-input"
                            />
                        </li>
                    ))}
                </ul>
                <button onClick={handleSubmit} className="submit-order-btn">
                    Rendelés Leadása ({Object.keys(cart).length} tétel)
                </button>
            </main>
        </div>
    );
}

export default OrderPage;