require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // <<<--- ITT VOLT A HIBA
const { authenticateToken } = require('./middleware/auth.middleware');

// --- Route Imports ---
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const stockRoutes = require('./routes/stock.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const dataRoutes = require('./routes/data.routes');

// --- App & DB Setup ---
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Sikeresen csatlakozva a MongoDB adatbázishoz!'));

// --- API Routes ---
// Publikus útvonalak (nem kell hozzájuk bejelentkezés)
app.use('/api/auth', authRoutes);

// Védett útvonalak (bejelentkezés szükséges)
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/stock', authenticateToken, stockRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/data', authenticateToken, dataRoutes);


// --- Server Start ---
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
});