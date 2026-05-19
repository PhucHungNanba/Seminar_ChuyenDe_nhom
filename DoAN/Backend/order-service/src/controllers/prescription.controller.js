const mongoose = require('mongoose');
const PrescriptionVault = require('../models/PrescriptionVault');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dr7blo9il',
  api_key: process.env.CLOUDINARY_API_KEY || '273856488716346',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'aRGu_t97a3MGOYuDGrtT1iXKfac'
});

const uploadFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'prescriptions' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

exports.createPrescription = async (req, res) => {
  try {
    const {
      customerPhone, thumbnailUrl, prescriptionCode,
      doctorName, hospital, diagnosis, issueDate, medicines, pharmacistNote, status,
    } = req.body;

    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!customerPhone) return res.status(400).json({ success: false, message: 'customerPhone is required' });
    if (!thumbnailUrl && !req.file) {
      return res.status(400).json({ success: false, message: 'thumbnailUrl or image file is required' });
    }

    let finalThumbnailUrl = thumbnailUrl;
    if (req.file) {
      try {
        const result = await uploadFromBuffer(req.file.buffer);
        finalThumbnailUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('[Cloudinary Upload Error]', uploadErr.message);
        return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary: ' + uploadErr.message });
      }
    }

    // Parse medicines in case it was passed as stringified JSON via FormData
    let targetMedicines = medicines;
    if (typeof medicines === 'string') {
      try {
        targetMedicines = JSON.parse(medicines);
      } catch (e) {
        targetMedicines = [];
      }
    }

    const parsedMedicines = Array.isArray(targetMedicines)
      ? targetMedicines
          .filter((m) => m?.productId && Number(m?.quantity) > 0)
          .map((m) => ({
            productId: new mongoose.Types.ObjectId(m.productId),
            name: m.name, quantity: Number(m.quantity), price: Number(m.price || 0),
          }))
      : [];

    const totalAmount = parsedMedicines.reduce((sum, m) => sum + m.price * m.quantity, 0);

    let computedExpiryDate = undefined;
    if (issueDate) {
      const date = new Date(issueDate);
      if (!isNaN(date.getTime())) {
        date.setDate(date.getDate() + 30);
        computedExpiryDate = date;
      }
    }

    const payload = {
      customerId: new mongoose.Types.ObjectId(customerId),
      customerPhone, thumbnailUrl: finalThumbnailUrl, prescriptionCode,
      doctorName, hospital, diagnosis,
      issueDate: issueDate ? new Date(issueDate) : undefined,
      expiryDate: computedExpiryDate,
      medicines: parsedMedicines, totalAmount, pharmacistNote,
    };
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) payload.status = status;

    const created = await PrescriptionVault.create(payload);
    return res.status(201).json({ success: true, message: 'Prescription request created', data: created });
  } catch (error) {
    console.error('[Prescription Create Error]', error.message);
    return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
  }
};

exports.getMyPrescriptions = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const data = await PrescriptionVault.find({ customerId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error: ' + error.message });
  }
};

// ── Admin: Get all prescription requests ────────────
exports.getAllRequests = async (req, res) => {
  try {
    const data = await PrescriptionVault.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ── Admin: Approve prescription + create quoted order ─
exports.approveRequest = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const reqId = req.params.id;

    const prescription = await PrescriptionVault.findById(reqId);
    if (!prescription) return res.status(404).json({ success: false, message: 'Not found' });

    // Update medicines list & status
    if (items && items.length > 0) {
      prescription.medicines = items.map(item => ({
        productId: new mongoose.Types.ObjectId(item._id || item.productId),
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }));
    }
    if (totalAmount) prescription.totalAmount = totalAmount;
    prescription.status = 'APPROVED';
    await prescription.save();

    // Sync into Cart of the customer
    let cart = await Cart.findOne({ customerId: prescription.customerId.toString() });
    if (!cart) {
      cart = new Cart({ customerId: prescription.customerId.toString(), items: [] });
    }

    const rxItems = (items || prescription.medicines).map(item => ({
      productId: (item._id || item.productId || '').toString(),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      isPrescription: true,
      prescriptionId: prescription._id.toString(),
    }));

    for (const rxItem of rxItems) {
      const existingIdx = cart.items.findIndex(
        i => i.productId === rxItem.productId && i.prescriptionId === rxItem.prescriptionId
      );
      if (existingIdx > -1) {
        cart.items[existingIdx].quantity = rxItem.quantity;
        cart.items[existingIdx].price = rxItem.price;
      } else {
        cart.items.push(rxItem);
      }
    }
    await cart.save();

    // Create a quoted (pending) order for the customer automatically
    const quotedItems = (items || prescription.medicines).map(item => ({
      productId: item._id || item.productId?.toString(),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new Order({
      userId: prescription.customerId.toString(),
      items: quotedItems,
      totalAmount: totalAmount || prescription.totalAmount,
      shippingAddress: 'TBD',
      paymentMethod: 'transfer',
      customerPhone: prescription.customerPhone,
      status: 'UNPAID',
      prescriptionId: prescription._id,
      prescriptionImageUrl: prescription.thumbnailUrl,
      isQuoted: true,
    });
    const savedOrder = await order.save();

    return res.status(200).json({ success: true, data: { prescription, cart, order: savedOrder } });
  } catch (error) {
    console.error('[Approve Error]', error.message);
    return res.status(500).json({ success: false, message: 'Error: ' + error.message });
  }
};

// ── Admin: Reject prescription request ───────────────
exports.rejectRequest = async (req, res) => {
  try {
    const prescription = await PrescriptionVault.findById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: 'Not found' });
    prescription.status = 'REJECTED';
    await prescription.save();
    return res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error' });
  }
};
