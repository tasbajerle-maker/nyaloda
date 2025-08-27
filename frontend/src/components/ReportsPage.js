import React from 'react';

function ReportsPage({ allOrders, usageLog, onNavigate }) {
    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Jelentések</h2>
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza</button>
            </header>
            <main>
                <section className="report-section">
                    <h3>Fogyási Napló</h3>
                    <table className="report-table">
                        <thead>
                            <tr><th>Dátum</th><th>Bolt</th><th>Termék</th><th>Mennyiség</th><th>Felhasználó</th></tr>
                        </thead>
                        <tbody>
                            {usageLog.map(log => (
                                <tr key={log.id}>
                                    <td>{new Date(log.date).toLocaleString()}</td>
                                    <td>{log.storeId}</td>
                                    <td>{log.productName}</td>
                                    <td>{log.quantity}</td>
                                    <td>{log.userId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}

export default ReportsPage;