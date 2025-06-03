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
  summary: {
    required: true,
    type: String,
    minlength: 10,
    maxlength: 255
  },
  description: {
    required: true,
    type: String,
    minlength: 10,
  },
  benefits: {
    required: true,
    type: String,
    minlength: 10,
  },
  composition: {
    type: String,
    minlength: 10,
  },
  specifications: {
    type: String,
    minlength: 10,
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
  images: [String],
  // facturapiid: { type: String, required: true }
}, { versionKey: false, timestamps: { createdAt: 'creationDate', updatedAt: 'lastDataModification' } });

module.exports = mongoose.model('Product', productSchema);
