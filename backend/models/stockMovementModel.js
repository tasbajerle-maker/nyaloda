const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  store: {
    type: String, // JAVÍTVA: Elfogadja a bolt nevét, pl. 'nyirpalota'
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['RECEIVE', 'WASTE', 'SALE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT', 'USAGE']
  },
  quantity: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;