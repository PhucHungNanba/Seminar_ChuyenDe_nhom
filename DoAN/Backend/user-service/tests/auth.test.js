const request = require('supertest');
const app = require('../src/app');

describe('Auth API (TDD)', () => {
  const sampleUser = {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User'
  };

  it('1. POST /api/users/register - Nên tạo tài khoản mới', async () => {
    const res = await request(app).post('/api/users/register').send(sampleUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.user.email).toBe(sampleUser.email);
  });

  it('2. POST /api/users/login - Nên đăng nhập thành công', async () => {
    await request(app).post('/api/users/register').send(sampleUser);
    const res = await request(app).post('/api/users/login').send({
      email: sampleUser.email,
      password: sampleUser.password
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.token).toBeDefined();
  });
});
