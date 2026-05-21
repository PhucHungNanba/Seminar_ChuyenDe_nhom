const mongoose = require('mongoose');
const PrescriptionVault = require('../src/models/PrescriptionVault');

describe('PrescriptionVault Model Validation Tests', () => {
  const validPrescriptionData = {
    customerId: new mongoose.Types.ObjectId(),
    customerPhone: '0987654321',
    thumbnailUrl: 'https://cloudinary.com/user_rx_123.jpg',
  };

  it('1. Nên khởi tạo thành công với requestCode tự động', async () => {
    const rx = await PrescriptionVault.create(validPrescriptionData);
    
    expect(rx).toBeDefined();
    expect(rx.requestCode).toBeDefined();
    expect(rx.requestCode).toMatch(/^RX-\d{4}-\d{3}$/); // Khớp dạng RX-YYYY-XXX
    expect(rx.status).toBe('PENDING'); // Trạng thái mặc định
  });

  it('2. Nên báo lỗi Validation Error nếu thiếu trường bắt buộc', async () => {
    // Thiếu customerPhone
    const invalidRx = new PrescriptionVault({
      customerId: new mongoose.Types.ObjectId(),
      thumbnailUrl: 'https://cloudinary.com/user_rx_123.jpg',
    });

    let error = null;
    try {
      await invalidRx.validate();
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
    expect(error.errors.customerPhone).toBeDefined();
  });

  it('3. Nên báo lỗi Validation Error nếu thiếu thumbnailUrl', async () => {
    // Thiếu thumbnailUrl
    const invalidRx = new PrescriptionVault({
      customerId: new mongoose.Types.ObjectId(),
      customerPhone: '0987654321',
    });

    let error = null;
    try {
      await invalidRx.validate();
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
    expect(error.errors.thumbnailUrl).toBeDefined();
  });
});
