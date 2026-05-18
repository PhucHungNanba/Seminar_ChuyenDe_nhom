const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, orderController.createOrder);
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

module.exports = router;
