import React from 'react';

function PartnerOrdersPage({ user, allOrders, onNavigate }) {
    // A partner felhasználóneve az email @ előtti része
    const userIdentifier = user.email.split('@')[0];
    
    // Kiszűrjük a rendelések közül azokat, amik ehhez a partnerhez tartoznak
    const myOrders = allOrders.filter(o => o.owner === userIdentifier);

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Rendeléseim</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza a portálra</button>
            </header>
            <main>
                {myOrders.length > 0 ? (
                    <ul className="order-history-list">
                        {myOrders.map(order => (
                            <li key={order.id} className={`order-history-item status-${order.status}`}>
                                <span><strong>ID:</strong> {order.orderId}</span>
                                <span><strong>Dátum:</strong> {order.date}</span>
                                <span><strong>Státusz:</strong> {order.status}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Még nincsenek rögzített rendeléseid.</p>
                )}
            </main>
        </div>
    );
}

export default PartnerOrdersPage;