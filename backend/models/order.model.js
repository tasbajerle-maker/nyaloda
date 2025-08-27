const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: String, 
    owner: String, 
    storeId: String, 
    date: String,
    status: String, 
    items: Object, 
    type: String
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;