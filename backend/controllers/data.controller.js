const Product = require('../models/product.model');
const Order = require('../models/order.model');
const StoreStock = require('../models/storeStock.model');
const UsageLog = require('../models/usageLog.model');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const TaskLog = require('../models/taskLog.model');

// Helper to convert docs to JSON with 'id'
const toJSONWithId = (doc) => {
    const jsonObj = doc.toJSON({ virtuals: true });
    jsonObj.id = jsonObj._id.toString();
    delete jsonObj._id;
    delete jsonObj.__v;
    return jsonObj;
};

exports.getAllData = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [products, orders, store, usage, users, tasks, taskLogs] = await Promise.all([
            Product.find(), 
            Order.find(), 
            StoreStock.find(),
            UsageLog.find().sort({ date: -1 }),
            User.find().select('-password'),
            Task.find(),
            TaskLog.find({ completionDate: { $gte: today } })
        ]);
        
        res.json({
            centralWarehouseStock: products.map(toJSONWithId),
            allOrders: orders.map(toJSONWithId),
            storeStock: store.map(toJSONWithId),
            usageLog: usage.map(toJSONWithId),
            allUsers: users.map(toJSONWithId),
            allTasks: tasks.map(toJSONWithId),
            taskLog: taskLogs.map(toJSONWithId)
        });
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};