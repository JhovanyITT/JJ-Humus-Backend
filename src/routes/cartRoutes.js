const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


// OPERATIONS
router.get('/history/:id', cartController.getHistoryUserCarts);
router.put('/addProduct', cartController.addProduct);
router.put('/removeProduct', cartController.removeProduct);
router.put('/closeCart', cartController.closeCart);

// CRUD
router.get('/', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);

module.exports = router;
