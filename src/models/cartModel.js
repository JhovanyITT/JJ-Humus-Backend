const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    code: {
    required: true,
    unique: true,
    type: String,
    default: uuidv4 
  },
  user: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number }
    }
  ],
  status: { 
    required: true, 
    type: String, 
    enum: ['ACTIVE', 'CLOSED'], 
    default: 'ACTIVE' 
  },
  subtotal: { 
    required: true, 
    type: Number, 
    default: 0 
  },
  total: { 
    required: true, 
    type: Number, 
    default: 0 
  },
  iva: { 
    required: true, 
    type: Number, 
    default: 0 
  },
  creationDate: { 
    required: true, 
    type: Date, default: 
    Date.now 
  },
  closingDate: { type: Date }
  // stripeId: {type: String},
}, { versionKey: false });

module.exports = mongoose.model('shopcarts', cartSchema);