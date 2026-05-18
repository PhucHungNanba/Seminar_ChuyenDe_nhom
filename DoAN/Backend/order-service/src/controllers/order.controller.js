const Order = require('../models/Order');
const axios = require('axios');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, prescriptionImageUrl } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are empty', code: 400 });
    }

    let totalAmount = 0;

    // Check with Product Service - dùng container name trong Docker network
    const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
    
    for (let item of items) {
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/${item.productId}`);
        const product = response.data.data;
        
        if (!product) {
            return res.status(400).json({ success: false, message: `Product ${item.productId} not found`, code: 400 });
        }
        const availableQty =
          product.quantity ??
          product.stock_quantity ??
          product.inventory?.stock_quantity ??
          0;

        if (availableQty < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}`, code: 400 });
        }
        
        // Update price from ground truth
        item.price = product.price;
        totalAmount += item.price * item.quantity;
      } catch (err) {
        console.error('Error fetching product:', err.message);
        return res.status(400).json({ success: false, message: `Failed to verify product ${item.productId}`, code: 400 });
      }
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      prescriptionImageUrl
    });

    await order.save();
    
    // Note: In a real system, we'd also call Product Service to deduct stock here, or use a message queue.

    res.status(201).json({ success: true, message: 'Order created', data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error', code: 500 });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    // Basic Admin/Pharmacist check
    if (!['admin', 'Admin', 'Pharmacist'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Requires admin role', code: 403 });
    }

    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found', code: 404 });
    }

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error', code: 500 });
  }
};
