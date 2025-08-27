import React, { useState } from 'react';
import { generatePdfForOrder } from '../utils/pdfGenerator';

function OrderAdminPage({ allOrders, centralStock, onNavigate, onApproveOrder, onReceiveOrder, onRejectOrder }) {
    const [showArchived, setShowArchived] = useState(false);

    const activeOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'approved');
    const archivedOrders = allOrders.filter(o => o.status === 'completed' || o.status === 'rejected');
    const ordersToShow = showArchived ? archivedOrders : activeOrders;

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Rendelések Kezelése</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza</button>
            </header>
            <main>
                <button onClick={() => setShowArchived(!showArchived)} style={{ marginBottom: '1rem' }}>
                    {showArchived ? 'Aktív Rendelések Mutatása' : 'Archívum Mutatása'}
                </button>
                <ul className="admin-order-list">
                    {ordersToShow.map(order => (
                        <li key={order.id} className="admin-order-item">
                            <strong>{order.owner} ({order.date}) - {order.status.toUpperCase()}</strong>
                            <ul>{Object.entries(order.items).map(([name, qty]) => <li key={name}>{name}: {qty}</li>)}</ul>
                            <div className="item-actions">
                                {order.status === 'pending' && (
                                    <>
                                        <button onClick={() => onApproveOrder(order.id)} className="approve-button">Jóváhagyás</button>
                                        <button onClick={() => onRejectOrder(order.id)} className="reject-button">Elutasítás</button>
                                    </>
                                )}
                                {order.status === 'approved' && order.type === 'store' && (
                                    <button onClick={() => onReceiveOrder(order.id)} className="receive-button">Áruátvétel</button>
                                )}
                                {showArchived && (
                                    <button onClick={() => generatePdfForOrder(order, centralStock)} className="pdf-button">PDF</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default OrderAdminPage;