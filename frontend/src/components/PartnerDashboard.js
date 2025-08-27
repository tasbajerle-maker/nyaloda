import React from 'react';

function PartnerDashboard({ user, onNavigate, onLogout }) {
    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Partner Portál</h2>
                <span>{user.email}</span>
                <button onClick={onLogout}>Kijelentkezés</button>
            </header>
            <main className="menu-grid">
                <button onClick={() => onNavigate('partnerOrder')}>Új Rendelés</button>
                <button onClick={() => onNavigate('partnerOrders')}>Rendeléseim</button>
            </main>
        </div>
    );
}

export default PartnerDashboard;