import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api';

// Komponensek
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import StoreSelectorPage from './components/StoreSelectorPage';
import StockPage from './components/StockPage';
import OrderPage from './components/OrderPage';
import OrderAdminPage from './components/OrderAdminPage';
import AdminPage from './components/AdminPage';
import PartnerDashboard from './components/PartnerDashboard';
import PartnerOrderPage from './components/PartnerOrderPage';
import PartnerOrdersPage from './components/PartnerOrdersPage';
import ManagerDashboardView from './components/ManagerDashboardView';
import DailyChecklistPage from './components/DailyChecklistPage';
import ReportsPage from './components/ReportsPage';
import ProductDetailPage from './components/ProductDetailPage';
import Bevetelezes from './components/Bevetelezes';
import Selejtezes from './components/Selejtezes';
import StockAdjustment from './components/StockAdjustment';
import UsagePage from './components/UsagePage';

function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('dashboard');
    const [pageParams, setPageParams] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [storeStock, setStoreStock] = useState([]);
    const [centralStock, setCentralStock] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [allTasks, setTasks] = useState([]);
    const [taskLog, setTaskLog] = useState([]);
    const [usageLog, setUsageLog] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stockMovements, setStockMovements] = useState([]);
    const [partnerPage, setPartnerPage] = useState('dashboard');
    const [currentStoreId, setCurrentStoreId] = useState(null);

    const fetchData = async () => {
        try {
            const data = await api.getAllData();
            setStoreStock(data.storeStock || []);
            setCentralStock(data.centralWarehouseStock || []);
            setAllOrders(data.allOrders || []);
            setTasks(data.allTasks || []);
            setTaskLog(data.taskLog || []);
            setAllUsers(data.allUsers || []);
            setUsageLog(data.usageLog || []);
            setStockMovements(data.stockMovements || []);
        } catch (error) {
            console.error("Adatlekérési hiba:", error);
            handleLogout();
        }
    };

    const handleLogin = async (email, password) => {
        try {
            setErrorMessage('');
            const { token, user } = await api.login(email, password);
            localStorage.setItem('authToken', token);
            setUser(user);
            if (user.role === 'employee' && user.storeIds?.length > 0) {
                setCurrentStoreId(user.storeIds[0]);
            }
            await fetchData();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setPage('dashboard');
        setPartnerPage('dashboard');
        localStorage.removeItem('authToken');
    };

    const handleNavigate = (targetPage, params = null) => {
        setPage(targetPage);
        setPageParams(params);
    };

    const handlePartnerNavigate = (targetPage) => {
        setPartnerPage(targetPage);
    };

    const handleStoreChange = (storeId) => {
        setCurrentStoreId(storeId);
    };

    const handleCreateOrder = async (cart) => {
        try {
            const orderData = { orderItems: cart, orderType: 'store', storeId: currentStoreId };
            await api.createOrder(orderData);
            alert('Rendelés sikeresen leadva!');
            await fetchData();
            handleNavigate('dashboard');
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };
    
    const handleCreatePartnerOrder = async (cart) => {
        try {
            const orderData = { orderItems: cart, orderType: 'partner' };
            await api.createOrder(orderData);
            alert('Rendelését sikeresen rögzítettük!');
            await fetchData();
            handlePartnerNavigate('dashboard');
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };

    const handleApproveOrder = async (orderId) => {
        try {
            await api.approveOrder(orderId);
            await fetchData();
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };

    const handleReceiveOrder = async (orderId) => {
        try {
            await api.receiveStoreOrder(orderId);
            await fetchData();
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };
    
    const handleCreateProduct = async (productData) => {
        try {
            await api.createProduct(productData);
            await fetchData();
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };
    
    const handleUpdateProduct = async (productId, productData) => {
        try {
            await api.updateProduct(productId, productData);
            alert('Termék sikeresen frissítve!');
            await fetchData();
            handleNavigate('admin');
        } catch (error) {
            alert(`Hiba a frissítéskor: ${error.message}`);
        }
    };

    const handleToggleVisibility = async (productId, newVisibility) => {
        try {
            await api.updateProduct(productId, { isPartnerVisible: newVisibility });
            await fetchData();
        } catch (error) {
            alert(`Hiba: ${error.message}`);
        }
    };

    const handleToggleTask = async (taskId, isCompleted) => {
        try {
            await api.logTask({ taskId, storeId: currentStoreId, isCompleted });
            await fetchData();
        } catch (error) {
            alert(`Hiba a feladat rögzítésekor: ${error.message}`);
        }
    };

    const handleStockReceive = async (barcode, quantity) => {
        try {
            await api.receiveProductByBarcode({ barcode, quantity });
            alert(`Sikeres bevételezés: ${quantity} db a '${barcode}' vonalkódú termékből.`);
            await fetchData();
        } catch (error) {
            alert(`Hiba a bevételezéskor: ${error.message}`);
            console.error(error);
        }
    };

    const handleWasteProduct = async (wasteData) => {
        try {
            await api.wasteProduct(wasteData);
            alert('Selejtezés sikeresen rögzítve.');
            await fetchData();
        } catch (error) {
            alert(`Hiba a selejtezéskor: ${error.message}`);
            console.error(error);
            throw error;
        }
    };
    
    const handleStockAdjustment = async (adjustmentData) => {
        try {
            await api.adjustStock(adjustmentData);
            alert('Készlet sikeresen módosítva.');
            await fetchData();
        } catch (error) {
            alert(`Hiba a készlet módosításakor: ${error.message}`);
            throw error;
        }
    };
    
    const handleLogRawMaterialUsage = async (usageData, storeId) => {
        try {
            const itemsToLog = Object.entries(usageData)
                .filter(([, qty]) => Number(qty) > 0)
                .map(([productId, quantity]) => ({ productId, quantity: Number(quantity) }));

            if (itemsToLog.length === 0) {
                return alert("Nincs megadva fogyás.");
            }
            
            await api.logRawMaterialUsage({ items: itemsToLog, storeId: storeId });
            alert('Fogyás sikeresen rögzítve.');
            await fetchData();
            handleNavigate('dashboard');
        } catch (error) {
            alert(`Hiba a fogyás rögzítésekor: ${error.message}`);
        }
    };

    const handleMoveToCounter = async (productId, quantity, storeId) => {
        try {
            const moveData = {
                items: { [productId]: quantity },
                storeId: storeId
            };
            await api.moveToCounter(moveData);
            alert('Termék sikeresen áthelyezve a pultba.');
            await fetchData();
        } catch (error) {
            alert(`Hiba az áthelyezéskor: ${error.message}`);
        }
    };

    const handleUseFromCounter = async (storeStockId) => {
        try {
            await api.useFromCounter({ storeStockId });
            await fetchData();
        } catch (error) {
            alert(`Hiba a felhasználás naplózásakor: ${error.message}`);
        }
    };

    const handleMoveFromCounterToBack = async (storeStockId, quantity) => {
        try {
            await api.moveFromCounterToBack({ storeStockId, quantity });
            await fetchData();
        } catch (error) {
            alert(`Hiba a visszaküldéskor: ${error.message}`);
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            await api.createUser(userData);
            alert('Felhasználó sikeresen létrehozva!');
            await fetchData();
        } catch (error) {
            alert(`Hiba a felhasználó létrehozásakor: ${error.message}`);
        }
    };

    // EZ AZ ÚJ FUNKCIÓ
    const handleLogUsage = async (usageData, storeId) => {
        try {
            await api.logUsage({ items: usageData, storeId: storeId });
            alert('Fogyás sikeresen rögzítve.');
            await fetchData();
        } catch (error) {
            alert(`Hiba a fogyás rögzítésekor: ${error.message}`);
        }
    };

    const renderEmployeeUI = () => {
        if (page === 'dashboard' && user.role === 'manager') {
            return (
                <>
                    <Dashboard user={user} allOrders={allOrders} onNavigate={handleNavigate} onLogout={handleLogout} currentStoreId={currentStoreId} onStoreChange={handleStoreChange} onReceiveOrder={handleReceiveOrder} />
                    <main style={{ padding: '2rem' }}>
                        <ManagerDashboardView 
                            allOrders={allOrders}
                            centralStock={centralStock}
                            taskLog={taskLog}
                        />
                    </main>
                </>
            );
        }

        switch (page) {
            case 'stores': return <StoreSelectorPage onNavigate={handleNavigate} />;
            case 'stock': 
                return <StockPage 
                            storeId={pageParams} 
                            storeStock={storeStock} 
                            onNavigate={handleNavigate}
                            onMoveToCounter={(productId, qty) => handleMoveToCounter(productId, qty, pageParams)}
                            onUseFromCounter={handleUseFromCounter}
                            onMoveFromCounterToBack={handleMoveFromCounterToBack}
                            onLogUsage={handleLogUsage} // EZ AZ ÚJ PROP
                        />;
            case 'order': return <OrderPage centralStock={centralStock} onNavigate={handleNavigate} onSubmitOrder={handleCreateOrder} />;
            case 'orderAdmin': return <OrderAdminPage allOrders={allOrders} centralStock={centralStock} onNavigate={handleNavigate} onApproveOrder={handleApproveOrder} onReceiveOrder={handleReceiveOrder} onRejectOrder={api.rejectOrder} />;
            case 'admin': 
                return <AdminPage 
                            centralStock={centralStock} 
                            allUsers={allUsers} 
                            allTasks={allTasks} 
                            onNavigate={handleNavigate} 
                            onCreateProduct={handleCreateProduct}
                            onToggleVisibility={handleToggleVisibility}
                            onCreateUser={handleCreateUser}
                            onDeleteUser={api.deleteUser}
                            onCreateTask={api.createTask}
                            onDeleteTask={api.deleteTask}
                        />;
            case 'checklist': return <DailyChecklistPage tasks={allTasks} taskLog={taskLog} onToggleTask={handleToggleTask} onNavigate={handleNavigate} />;
            case 'reports': 
                return <ReportsPage 
                            stockMovements={stockMovements}
                            allUsers={allUsers}
                            centralStock={centralStock}
                            onNavigate={handleNavigate} 
                        />;
            case 'productDetail': {
                const productToEdit = centralStock.find(p => p.id === pageParams);
                return <ProductDetailPage product={productToEdit} onNavigate={handleNavigate} onUpdateProduct={handleUpdateProduct} />;
            }
            case 'bevetelezes': {
                return <Bevetelezes onSubmit={handleStockReceive} onNavigate={handleNavigate} />;
            }
            case 'waste': {
                return <Selejtezes centralStock={centralStock} onSubmit={handleWasteProduct} onNavigate={handleNavigate} />;
            }
            case 'adjust-stock': {
                return <StockAdjustment centralStock={centralStock} onSubmit={handleStockAdjustment} onNavigate={handleNavigate} />;
            }
            case 'usage': {
                return <UsagePage centralStock={centralStock} storeId={currentStoreId} onSubmitUsage={handleLogRawMaterialUsage} onNavigate={handleNavigate} />;
            }
            case 'dashboard': 
            default: 
                return <Dashboard user={user} allOrders={allOrders} onNavigate={handleNavigate} onLogout={handleLogout} currentStoreId={currentStoreId} onStoreChange={handleStoreChange} onReceiveOrder={handleReceiveOrder} />;
        }
    };

    const renderPartnerUI = () => {
        switch (partnerPage) {
            case 'partnerOrder': return <PartnerOrderPage centralStock={centralStock} onNavigate={handlePartnerNavigate} onSubmitOrder={handleCreatePartnerOrder} />;
            case 'partnerOrders': return <PartnerOrdersPage user={user} allOrders={allOrders} onNavigate={handlePartnerNavigate} />;
            case 'dashboard': default: return <PartnerDashboard user={user} onNavigate={handlePartnerNavigate} onLogout={handleLogout} />;
        }
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} errorMessage={errorMessage} />;
    }

   return (
     <div className="App">
         {user.role === 'partner' ? renderPartnerUI() : renderEmployeeUI()}
     </div>
   );
}

export default App;