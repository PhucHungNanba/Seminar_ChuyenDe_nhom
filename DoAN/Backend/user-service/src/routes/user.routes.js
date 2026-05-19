const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, verifyAdminOrPharmacist } = require('../middlewares/auth');

// Vì API Gateway strip /api/users trước khi forward, nên các routes ở đây map trực tiếp tới root '/'
router.get('/', verifyToken, verifyAdminOrPharmacist, userController.getAllUsers);
router.put('/:id', verifyToken, verifyAdminOrPharmacist, userController.updateUser);
router.delete('/:id', verifyToken, verifyAdminOrPharmacist, userController.deleteUser);

module.exports = router;
