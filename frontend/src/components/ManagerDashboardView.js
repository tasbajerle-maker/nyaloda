import React from 'react';

// JAVÍTÁS 1: Itt már a külön prop-okat várjuk, nem az 'appData' dobozt.
function ManagerDashboardView({ allOrders, centralStock, taskLog }) {
    
    // JAVÍTÁS 2: Mivel már közvetlenül kapjuk az adatokat, nem kell az 'appData.' előtag.
    const pendingOrdersCount = allOrders.filter(o => o.status === 'pending').length;
    const lowStockItems = centralStock.filter(p => p.quantity < 10 && p.type === 'raw');

    const taskLeaderboard = Object.entries(
        taskLog.reduce((acc, log) => {
            acc[log.userId] = (acc[log.userId] || 0) + 1;
            return acc;
        }, {})
    ).sort(([, a], [, b]) => b - a).slice(0, 3);

    return (
        <div className="dashboard-grid" style={{ padding: '0 2rem' }}>
            <div className="dashboard-card">
                <h3>Függő Rendelések</h3>
                <p className="value">{pendingOrdersCount}</p>
            </div>
            <div className="dashboard-card alert">
                <h3>Kritikus Alapanyag Készlet (&lt;10)</h3>
                {lowStockItems.length > 0 ? (
                    <ul>
                        {lowStockItems.map(p => <li key={p.id}>{p.name}: <strong>{p.quantity}</strong> {p.unit}</li>)}
                    </ul>
                ) : <p>Minden rendben.</p>}
            </div>
            <div className="dashboard-card leaderboard">
                <h3>🏆 A Hét Hősei (Feladatok)</h3>
                {taskLeaderboard.length > 0 ? (
                    <ol>
                        {taskLeaderboard.map(([user, count]) => <li key={user}>{user.split('@')[0]}: <strong>{count}</strong> db</li>)}
                    </ol>
                ) : <p>Nincs adat.</p>}
            </div>
        </div>
    );
}

export default ManagerDashboardView;