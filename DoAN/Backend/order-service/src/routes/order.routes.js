const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const prescriptionController = require('../controllers/prescription.controller');
const { verifyToken, verifyAdminOrPharmacist, verifyCustomer } = require('../middlewares/auth');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// ── Customer routes ──────────────────────────────────
router.post('/', verifyToken, verifyCustomer, orderController.createOrder);
router.get('/my', verifyToken, verifyCustomer, orderController.getMyOrders);

// ── Prescription routes (Customer) ───────────────────
router.post('/prescriptions', verifyToken, verifyCustomer, upload.single('image'), prescriptionController.createPrescription);
router.get('/prescriptions/my', verifyToken, verifyCustomer, prescriptionController.getMyPrescriptions);

// ── Admin / Pharmacist routes ────────────────────────
router.get('/dashboard/stats', verifyToken, verifyAdminOrPharmacist, orderController.getDashboardStats);
router.get('/all', verifyToken, verifyAdminOrPharmacist, orderController.getAllOrders);
router.put('/:id/status', verifyToken, verifyAdminOrPharmacist, orderController.updateOrderStatus);
router.get('/revenue/dashboard', verifyToken, verifyAdminOrPharmacist, orderController.getRevenueDashboard);

router.get('/prescriptions/requests', verifyToken, verifyAdminOrPharmacist, prescriptionController.getAllRequests);
router.post('/prescriptions/:id/approve', verifyToken, verifyAdminOrPharmacist, prescriptionController.approveRequest);
router.patch('/prescriptions/:id/approve', verifyToken, verifyAdminOrPharmacist, prescriptionController.approveRequest);
router.post('/prescriptions/:id/reject', verifyToken, verifyAdminOrPharmacist, prescriptionController.rejectRequest);
router.patch('/prescriptions/:id/reject', verifyToken, verifyAdminOrPharmacist, prescriptionController.rejectRequest);

// ── Dynamic parameter routes (Must be at the very bottom to avoid hijacking static paths) ──
router.get('/:id', verifyToken, orderController.getOrderById);

module.exports = router;
