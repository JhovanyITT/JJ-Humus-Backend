const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CRUD
router.get('/', productController.getAllProducts);
router.get('/:code', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:code', productController.updateProduct);
router.delete('/:code', productController.deleteProduct);

module.exports = router;

