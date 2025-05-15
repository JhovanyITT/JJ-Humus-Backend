const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
    enum: ['activo', 'cerrado'], 
    default: 'activo' 
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
});

module.exports = mongoose.model('shopcarts', cartSchema);