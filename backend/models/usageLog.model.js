const mongoose = require('mongoose');

const UsageLogSchema = new mongoose.Schema({
    productId: String, 
    productName: String, 
    quantity: Number, 
    unit: String,
    storeId: String, 
    userId: String, 
    date: { type: Date, default: Date.now }
});

const UsageLog = mongoose.model('UsageLog', UsageLogSchema);

module.exports = UsageLog;