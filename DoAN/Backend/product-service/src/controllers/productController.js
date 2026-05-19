const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { search, q, name } = req.query;
    let query = {};
    if (search || q || name) {
      const searchTerm = search || q || name;
      query.name = { $regex: searchTerm, $options: 'i' };
    }
    const products = await Product.find(query);
    res.status(200).json({ success: true, data: products });
  } catch (err) { next(err); }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
};

exports.searchBySymptoms = async (req, res, next) => {
  try {
    const { tags, name } = req.query;
    let query = {};
    
    if (tags) {
      const tagsArray = tags.split(',').map(t => t.trim());
      query.symptomTags = { $in: tagsArray };
    }
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const products = await Product.find(query);
    res.status(200).json({ success: true, data: products });
  } catch (err) { next(err); }
};

// ── Admin: Get all inventory items ─────────────────────
exports.getInventory = async (req, res, next) => {
  try {
    const products = await Product.find().lean();
    const inventoryData = products.map(p => {
      // Ensure stockLocations is structured correctly
      const stockLocations = p.inventory || {
        'Kho Tổng': p.quantity || 0,
        'CH Quận 1': 0,
        'CH Quận 5': 0
      };
      return {
        _id: p._id,
        name: p.name,
        stockLocations
      };
    });
    res.status(200).json({ success: true, data: inventoryData });
  } catch (err) { next(err); }
};

// ── Admin: Update stock at a specific location ────────
exports.updateInventory = async (req, res, next) => {
  try {
    const { branch, quantity } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const currentInventory = product.inventory || {
      'Kho Tổng': product.quantity || 0,
      'CH Quận 1': 0,
      'CH Quận 5': 0
    };

    currentInventory[branch] = Number(quantity);
    product.inventory = currentInventory;

    // Update overall quantity
    product.quantity = Object.values(currentInventory).reduce((sum, val) => sum + Number(val || 0), 0);

    // Support legacy field
    product.stock_quantity = product.quantity;

    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (err) { next(err); }
};

// ── Order Service: Deduct stock after checkout ─────────
exports.deductStock = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const qtyToDeduct = Number(quantity || 0);

    // Deduct from 'Kho Tổng' first, then other branches if needed, or simply deduct from overall quantity
    const currentInventory = product.inventory || {
      'Kho Tổng': product.quantity || 0,
      'CH Quận 1': 0,
      'CH Quận 5': 0
    };

    if (currentInventory['Kho Tổng'] >= qtyToDeduct) {
      currentInventory['Kho Tổng'] -= qtyToDeduct;
    } else {
      let remaining = qtyToDeduct - currentInventory['Kho Tổng'];
      currentInventory['Kho Tổng'] = 0;
      for (const branch of Object.keys(currentInventory)) {
        if (remaining <= 0) break;
        if (currentInventory[branch] >= remaining) {
          currentInventory[branch] -= remaining;
          remaining = 0;
        } else {
          remaining -= currentInventory[branch];
          currentInventory[branch] = 0;
        }
      }
    }

    product.inventory = currentInventory;
    product.quantity = Object.values(currentInventory).reduce((sum, val) => sum + Number(val || 0), 0);
    product.stock_quantity = product.quantity;

    await product.save();
    res.status(200).json({ success: true, message: 'Stock deducted successfully', data: product });
  } catch (err) { next(err); }
};
