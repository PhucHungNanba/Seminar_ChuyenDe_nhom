const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/Product');

describe('Product API (TDD)', () => {
  const sampleProduct = {
    name: 'Panadol Extra',
    description: 'Giảm đau hạ sốt nhanh',
    price: 65000,
    quantity: 100,
    images: ['panadol.jpg'],
    symptomTags: ['đau đầu', 'sốt']
  };

  it('1. Nên tạo được một sản phẩm mới (POST /api/products)', async () => {
    const res = await request(app).post('/').send(sampleProduct);
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.name).toBe(sampleProduct.name);
  });

  it('2. Nên lấy được danh sách sản phẩm (GET /api/products)', async () => {
    await Product.create(sampleProduct);
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });

  it('3. Tìm kiếm sản phẩm qua tags triệu chứng (GET /api/products/search?tags=sốt)', async () => {
    await Product.create(sampleProduct);
    await Product.create({ ...sampleProduct, name: 'Thuốc dạ dày', symptomTags: ['đau dạ dày'] });

    const res = await request(app).get('/search?tags=sốt');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Panadol Extra');
  });

  it('4. Nên cập nhật và xóa được sản phẩm', async () => {
    const product = await Product.create(sampleProduct);
    
    // Update
    let res = await request(app).put(`/${product._id}`).send({ price: 70000 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.price).toBe(70000);

    // Delete
    res = await request(app).delete(`/${product._id}`);
    expect(res.statusCode).toEqual(200);

    // Verify deleted
    const found = await Product.findById(product._id);
    expect(found).toBeNull();
  });
});
