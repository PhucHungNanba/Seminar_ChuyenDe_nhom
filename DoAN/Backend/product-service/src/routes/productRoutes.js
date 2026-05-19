const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Đặt route cụ thể (/search) lên trước các route có param động (/:id)
router.get('/search', productController.searchBySymptoms);

// Inventory Routes
router.get('/inventory', productController.getInventory);
router.put('/inventory/:id', productController.updateInventory);
router.post('/deduct-stock', productController.deductStock);

// CRUD routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
