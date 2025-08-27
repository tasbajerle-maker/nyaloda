const mongoose = require('mongoose');

const StockItemSchema = new mongoose.Schema({
    storeId: String, 
    stockType: { type: String, required: true, enum: ['backFreezer', 'pult'] },
    productId: String, 
    name: String, 
    quantity: Number
});

const StoreStock = mongoose.model('StoreStock', StockItemSchema);

module.exports = StoreStock;