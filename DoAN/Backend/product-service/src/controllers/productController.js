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
    const products = await Product.find();
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
      // Tìm kiếm theo tên (không phân biệt hoa thường)
      query.name = { $regex: name, $options: 'i' };
    }

    const products = await Product.find(query);
    res.status(200).json({ success: true, data: products });
  } catch (err) { next(err); }
};
