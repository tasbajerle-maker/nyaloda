const API_BASE_URL = 'http://localhost:5000/api';

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
    
    // Kezeljük azt az esetet, ha a válasz nem JSON
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
export const login = (email, password) => request('/auth/login', 'POST', { email, password });

// Data Fetching
export const getAllData = () => request('/data');

// Products
export const createProduct = (productData) => request('/products', 'POST', productData);
export const updateProduct = (productId, productData) => request(`/products/${productId}`, 'PATCH', productData);

// Orders
export const createOrder = (orderData) => request('/orders', 'POST', orderData);
export const approveOrder = (orderId) => request(`/orders/${orderId}/approve`, 'POST');
export const rejectOrder = (orderId) => request(`/orders/${orderId}/reject`, 'POST');

// Stock
export const receiveStoreOrder = (orderId) => request(`/stock/receive/${orderId}`, 'POST');
export const moveToCounter = (moveData) => request('/stock/move-to-counter', 'POST', moveData);
export const logUsage = (usageData) => request('/stock/log-usage', 'POST', usageData);

// Users
export const createUser = (userData) => request('/users', 'POST', userData);
export const deleteUser = (userId) => request(`/users/${userId}`, 'DELETE');

// Tasks
export const createTask = (taskData) => request('/tasks', 'POST', taskData);
export const deleteTask = (taskId) => request(`/tasks/${taskId}`, 'DELETE');
export const logTask = (taskData) => request('/tasks/log', 'POST', taskData);