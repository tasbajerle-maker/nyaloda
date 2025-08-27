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

    const renderEmployeeUI = () => {
        if (page === 'dashboard' && user.role === 'manager') {
            return (
                <>
                    <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} currentStoreId={currentStoreId} onStoreChange={handleStoreChange} />
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
            case 'stock': return <StockPage storeId={pageParams} storeStock={storeStock} onNavigate={handleNavigate} />;
            case 'order': return <OrderPage centralStock={centralStock} onNavigate={handleNavigate} onSubmitOrder={handleCreateOrder} />;
            case 'orderAdmin': return <OrderAdminPage allOrders={allOrders} centralStock={centralStock} onNavigate={handleNavigate} onApproveOrder={handleApproveOrder} onReceiveOrder={handleReceiveOrder} />;
            case 'admin': 
                return <AdminPage 
                            centralStock={centralStock} 
                            allUsers={allUsers} 
                            allTasks={allTasks} 
                            onNavigate={handleNavigate} 
                            onCreateProduct={handleCreateProduct}
                            onToggleVisibility={handleToggleVisibility}
                        />;
            case 'checklist': 
                return <DailyChecklistPage 
                            tasks={allTasks} 
                            taskLog={taskLog} 
                            onToggleTask={handleToggleTask} 
                            onNavigate={handleNavigate}
                        />;
            case 'reports':
                return <ReportsPage
                            usageLog={usageLog}
                            taskLog={taskLog}
                            allTasks={allTasks}
                            onNavigate={handleNavigate}
                        />;
            case 'productDetail': {
                const productToEdit = centralStock.find(p => p.id === pageParams);
                return <ProductDetailPage 
                            product={productToEdit} 
                            onNavigate={handleNavigate} 
                            onUpdateProduct={handleUpdateProduct} 
                        />;
            }
            case 'dashboard': 
            default: 
                return <Dashboard 
                            user={user} 
                            onNavigate={handleNavigate} 
                            onLogout={handleLogout} 
                            currentStoreId={currentStoreId}
                            onStoreChange={handleStoreChange}
                        />;
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
        <div>
            {user.role === 'partner' ? renderPartnerUI() : renderEmployeeUI()}
        </div>
    );
}

export default App;