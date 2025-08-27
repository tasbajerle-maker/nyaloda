import React from 'react';

// Ez a komponens kap egy 'onNavigate' funkciót, amivel tudja, hova küldje a felhasználót
function StoreSelectorPage({ onNavigate }) {
    // Egyelőre a boltok listája fix, később ez jöhet a backendről
    const stores = [
        { id: 'oceanarok', name: 'Óceánárok' },
        { id: 'kiraly', name: 'Király utca' },
        { id: 'nyirpalota', name: 'Nyírpalota' }
    ];

    return (
        <div className="page-container">
            <header className="app-header">
                <h2>Boltválasztás</h2>
                {/* A 'dashboard'-ra kattintva visszalépünk a főmenübe */}
                <button onClick={() => onNavigate('dashboard')}>&larr; Vissza</button>
            </header>
            <main className="dashboard-main">
                <div className="menu-grid">
                    {stores.map(store => (
                        <button
                            key={store.id}
                            className="menu-button"
                            // A 'stock' oldalra navigálunk, és átadjuk a bolt ID-ját is
                            onClick={() => onNavigate('stock', store.id)}
                        >
                            {store.name}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default StoreSelectorPage;