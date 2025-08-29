const mongoose = require('mongoose');

const StockItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    inventoryType: { // <-- ÚJ MEZŐ
        type: String,
        required: true,
        enum: ['FINISHED_GOOD', 'RAW_MATERIAL'],
        default: 'FINISHED_GOOD'
    },
    storeId: String, 
    stockType: { type: String, required: true, enum: ['backFreezer', 'pult'] },
    productId: String,
    name: String, 
    quantity: Number
});

const StoreStock = mongoose.model('StoreStock', StockItemSchema);

module.exports = StoreStock;