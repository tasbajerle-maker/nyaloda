import React from 'react';

function StockPage({ storeId, storeStock, onNavigate, onMoveToCounter }) {
    const backFreezer = storeStock.filter(item => item.storeId === storeId && item.stockType === 'backFreezer' && item.quantity > 0);
    const counter = storeStock.filter(item => item.storeId === storeId && item.stockType === 'pult');

    const handleMove = (item) => {
        const qty = parseInt(prompt(`Mennyit szeretnél áthelyezni a '${item.name}' termékből? (Max: ${item.quantity})`, "1"), 10);
        if (qty > 0 && qty <= item.quantity) {
            onMoveToCounter(item.productId, qty);
        } else if (qty > item.quantity) {
            alert("Nincs ennyi a raktárban!");
        }
    };

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Készlet: {storeId.toUpperCase()}</h2>
                <button onClick={() => onNavigate('stores')}>&larr; Vissza a boltokhoz</button>
            </header>
            <main className="stock-main">
                <div className="inventory-column">
                    <h3>Hátsó Fagyasztó</h3>
                    <ul>
                        {backFreezer.length > 0 ? backFreezer.map(item => (
                            <li key={item.id}>
                                <span>{item.name}</span>
                                <span>{item.quantity} db</span>
                                <button onClick={() => handleMove(item)}>&gt;&gt;</button>
                            </li>
                        )) : <li>A raktár üres.</li>}
                    </ul>
                </div>
                <div className="inventory-column">
                    <h3>Pult</h3>
                    <ul>
                        {counter.length > 0 ? counter.map(item => (
                            <li key={item.id}>
                                <span>{item.name}</span>
                                <span>{item.quantity} db</span>
                            </li>
                        )) : <li>A pult üres.</li>}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default StockPage;