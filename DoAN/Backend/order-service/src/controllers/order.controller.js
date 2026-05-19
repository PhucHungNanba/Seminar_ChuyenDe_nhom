const Order = require('../models/Order');
const PrescriptionVault = require('../models/PrescriptionVault');
const axios = require('axios');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, customerName, customerPhone, customerEmail, note } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are empty', code: 400 });
    }

    let totalAmount = 0;
    const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

    try {
      const productChecks = items.map(item =>
        axios.get(`${PRODUCT_SERVICE_URL}/${item.productId}`, { timeout: 5000 })
          .then(response => ({ item, product: response.data.data || response.data }))
          .catch(err => { throw new Error(`Failed to verify product ${item.productId}`); })
      );
      const results = await Promise.all(productChecks);

      for (let { item, product } of results) {
        if (!product) return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
        const availableQty = product.inventory?.stock_quantity ?? product.stock_quantity ?? product.quantity ?? 0;
        if (availableQty < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        }
        item.price = product.price;
        totalAmount += item.price * item.quantity;
      }
    } catch (err) {
      console.error('[Order Validation Error]', err.message);
      return res.status(503).json({ success: false, message: err.message, code: 503 });
    }

    const order = new Order({ userId, items, totalAmount, shippingAddress, paymentMethod, customerName, customerPhone, customerEmail, note, status: 'UNPAID' });
    const savedOrder = await order.save();
    res.status(201).json({ success: true, message: 'Order created', data: savedOrder });
  } catch (err) {
    console.error('[Order Create Error]', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error: ' + err.message });
  }
};

// ── Admin: Update order status ────────────────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = ['UNPAID', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // When PROCESSING: deduct stock
    if (status === 'PROCESSING') {
      const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
      for (const item of order.items) {
        try {
          await axios.post(`${PRODUCT_SERVICE_URL}/deduct-stock`, {
            productId: item.productId,
            quantity: item.quantity
          }, { timeout: 5000 });
        } catch (e) {
          console.warn('[Stock Deduct Warning]', e.message);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ── Admin: Get all orders ─────────────────────────────
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ── Customer: Get my orders ───────────────────────────
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ── Revenue dashboard data ────────────────────────────
exports.getRevenueDashboard = async (req, res, next) => {
  try {
    // Last 7 days revenue from paid/completed orders
    const today = new Date();
    const results = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const end   = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      const orders = await Order.find({ 
        status: { $in: ['PAID', 'COMPLETED'] },
        createdAt: { $gte: start, $lte: end } 
      }).lean();
      const amount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      results.push({ date: `${day.getDate().toString().padStart(2,'0')}/${(day.getMonth()+1).toString().padStart(2,'0')}`, amount });
    }
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

// ── Get order by ID or orderCode ──────────────────────
exports.getOrderById = async (req, res, next) => {
  try {
    const idOrCode = req.params.id;
    let order = await Order.findOne({
      $or: [
        { orderCode: idOrCode },
        { _id: idOrCode.match(/^[0-9a-fA-F]{24}$/) ? idOrCode : undefined }
      ].filter(cond => cond._id !== undefined || cond.orderCode !== undefined)
    }).lean();

    // Fallback if not found and matches ObjectId pattern
    if (!order && idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(idOrCode).lean();
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Pharmacist' &&
      order.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('[Get Order Error]', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ── Admin: Get Dashboard Stats ────────────────────────
exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. totalRevenue: Tổng doanh thu của các đơn hàng có trạng thái COMPLETED
    const completedOrdersList = await Order.find({ status: 'COMPLETED' }).lean();
    const totalRevenue = completedOrdersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // 2. pendingRx: Tổng số lượng đơn hàng chứa thuốc kê đơn (Rx) đang chờ duyệt
    const pendingRx = await PrescriptionVault.countDocuments({ status: 'PENDING' });

    // 3. lowStockProducts: Đếm số lượng sản phẩm có inventory.stock_quantity < 20
    const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
    let lowStockProducts = 0;
    try {
      const prodRes = await axios.get(`${PRODUCT_SERVICE_URL}/`, { timeout: 5000 });
      const productsList = prodRes.data?.data || prodRes.data || [];
      lowStockProducts = productsList.filter(p => {
        const stock = p.inventory?.stock_quantity ?? p.stock_quantity ?? p.quantity ?? 0;
        return stock < 20;
      }).length;
    } catch (prodErr) {
      console.error('[Dashboard Stats - Product Service Error]', prodErr.message);
      lowStockProducts = 0;
    }

    // 4. completedOrders: Tổng số đơn hàng COMPLETED
    const completedOrders = completedOrdersList.length;

    // 5. revenueChart: Mảng dữ liệu doanh thu nhóm theo 7 ngày gần nhất
    const today = new Date();
    const revenueChart = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const end   = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      
      const dailyOrders = await Order.find({ 
        status: 'COMPLETED',
        createdAt: { $gte: start, $lte: end } 
      }).lean();
      const amount = dailyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      revenueChart.push({
        date: `${day.getDate().toString().padStart(2,'0')}/${(day.getMonth()+1).toString().padStart(2,'0')}`,
        revenue: amount,
        amount: amount
      });
    }

    // 6. ordersByStatus: Đếm số lượng đơn hàng theo từng trạng thái
    const ordersByStatus = {
      PENDING: await Order.countDocuments({ status: { $in: ['UNPAID', 'PAID'] } }),
      PROCESSING: await Order.countDocuments({ status: 'PROCESSING' }),
      SHIPPED: await Order.countDocuments({ status: 'SHIPPED' }),
      COMPLETED: await Order.countDocuments({ status: 'COMPLETED' }),
      CANCELLED: await Order.countDocuments({ status: 'CANCELLED' })
    };

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        pendingRx,
        lowStockProducts,
        completedOrders,
        revenueChart,
        ordersByStatus
      }
    });
  } catch (err) {
    console.error('[Get Dashboard Stats Error]', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error: ' + err.message });
  }
};

