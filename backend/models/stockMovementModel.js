// Fájl: backend/models/stockMovementModel.js

const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product' // Hivatkozás a 'Product' modellre
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Hivatkozás a 'User' modellre
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store' // Hivatkozás a 'Store' modellre
  },
  type: {
    type: String,
    required: true,
    enum: ['RECEIVE', 'WASTE', 'SALE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT']
  },
  quantity: {
    type: Number,
    required: true // Pozitív vagy negatív szám
  },
  notes: {
    type: String
  }
}, {
  timestamps: true // Automatikusan hozzáadja a created_at és updated_at mezőket
});

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;