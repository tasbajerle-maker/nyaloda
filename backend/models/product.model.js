const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: String,
    barcode: { type: String, unique: true, sparse: true },
    unit: String,
    type: String,
    quantity: Number,
    isPartnerVisible: { type: Boolean, default: false },
    datasheet: { type: String, default: '' }, 
    partnerPrice: { perKg: Number, perPiece: Number, perPackage: Number }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;