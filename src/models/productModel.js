const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    required: true,
    unique: true,
    type: String,
    maxlength: 20
  },
  name: {
    required: true,
    type: String,
    minlength: 5,
    maxlength: 30
  },
  brand: {
    required: true,
    type: String,
    minlength: 5,
    maxlength: 30
  },
  description: {
    required: true,
    type: String,
    minlength: 10,
    maxlength: 255
  },
  price: {
    required: true,
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    required: true,
    type: String,
    enum: ['Agricola', 'Acuacultura']
  },
  stock: {
    required: true,
    type: Number,
    min: 0,
    default: 0
  },
  creationDate: {
    required: true,
    type: Date,
    default: Date.now
  },
  lastDataModification: {
    required: true,
    type: Date,
    default: Date.now
  },
  images: [String],
  // facturapiid: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Product', productSchema);
