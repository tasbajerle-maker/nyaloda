const API_BASE_URL = 'http://192.168.0.28:5000';

const getToken = () => localStorage.getItem('authToken');

async function request(endpoint, method = 'GET', body = null) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Hiba a(z) ${endpoint} hívásakor.`);
        }
        return data;
    } else {
        const textData = await response.text();
        if (!response.ok) {
             throw new Error(textData || `Hiba a(z) ${endpoint} hívásakor.`);
        }
        return textData;
    }
}

// Auth
export const login = (email, password) => request('/api/auth/login', 'POST', { email, password });

// Data Fetching
export const getAllData = () => request('/api/data');

// Products
export const createProduct = (productData) => request('/api/products', 'POST', productData);
export const updateProduct = (productId, productData) => request(`/api/products/${productId}`, 'PATCH', productData);

// Orders
export const createOrder = (orderData) => request('/api/orders', 'POST', orderData);
export const approveOrder = (orderId) => request(`/api/orders/${orderId}/approve`, 'POST');
export const rejectOrder = (orderId) => request(`/api/orders/${orderId}/reject`, 'POST');

// Stock
export const receiveStoreOrder = (orderId) => request(`/api/stock/receive/${orderId}`, 'POST');
export const moveToCounter = (moveData) => request('/api/stock/move-to-counter', 'POST', moveData);
export const logUsage = (usageData) => request('/api/stock/log-usage', 'POST', usageData);

// Users
export const createUser = (userData) => request('/api/users', 'POST', userData);
export const deleteUser = (userId) => request(`/api/users/${userId}`, 'DELETE');

// Tasks
export const createTask = (taskData) => request('/api/tasks', 'POST', taskData);
export const deleteTask = (taskId) => request(`/api/tasks/${taskId}`, 'DELETE');
export const logTask = (taskData) => request('/api/tasks/log', 'POST', taskData);

// Stock Movement Functions
export const receiveProductByBarcode = (data) => request('/api/products/receive-by-barcode', 'POST', data);
export const wasteProduct = (data) => request('/api/products/waste', 'POST', data);
export const adjustStock = (data) => request('/api/products/adjust-stock', 'POST', data);
export const logRawMaterialUsage = (data) => request('/api/stock/log-raw-material-usage', 'POST', data);
export const useFromCounter = (data) => request('/api/stock/use-from-counter', 'POST', data);
export const moveFromCounterToBack = (data) => request('/api/stock/move-from-counter-to-back', 'POST', data);
// Az 'adjustCounterStock' funkció innen el lett távolítva.