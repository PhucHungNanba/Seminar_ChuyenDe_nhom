const request = require('supertest');
const app = require('../src/app');
const Order = require('../src/models/Order');
const jwt = require('jsonwebtoken');
const axios = require('axios');

jest.mock('axios');

describe('Order API (TDD)', () => {
  let userToken;
  let adminToken;

  beforeAll(() => {
    userToken = jwt.sign({ id: 'user123', role: 'Customer' }, 'super_secret_key');
    adminToken = jwt.sign({ id: 'admin123', role: 'Admin' }, 'super_secret_key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const sampleOrderReq = {
    items: [{ productId: 'prod1', quantity: 2, price: 50 }],
    shippingAddress: '123 Main St'
  };

  it('1. POST /api/orders - Nên tạo đơn hàng khi product có đủ hàng', async () => {
    axios.get.mockResolvedValue({
      data: { data: { _id: 'prod1', name: 'Test Prod', price: 50, quantity: 10 } }
    });

    const res = await request(app)
      .post('/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sampleOrderReq);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.totalAmount).toBe(100);
  });

  it('2. PUT /api/orders/:id/status - Nên cho phép Admin update trạng thái', async () => {
    const order = await Order.create({
      userId: 'user123',
      items: [{ productId: 'prod1', quantity: 2, price: 50 }],
      totalAmount: 100,
      shippingAddress: '123 Main St',
      status: 'UNPAID'
    });

    const res = await request(app)
      .put(`/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PAID' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.status).toBe('PAID');
  });

  it('3. PUT /api/orders/:id/status - Báo lỗi nếu không phải Admin', async () => {
    const res = await request(app)
      .put('/some_id/status')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'PAID' });

    expect(res.statusCode).toEqual(403);
  });
});
