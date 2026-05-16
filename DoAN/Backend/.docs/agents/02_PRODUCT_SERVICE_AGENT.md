# 🤖 PHASE 2: PRODUCT SERVICE GENERATION

**CONTEXT:** Xây dựng service quản lý thuốc bằng Node.js, Express, Mongoose. Thư mục làm việc: `product-service`.

**TASKS CHO AI:**
Hãy tuân thủ cấu trúc thư mục hiện có và sinh code:

- [ ] 1. `models/Product.js`: Tạo Schema Mongoose với các trường `name`, `description`, `price`, `stock`, `tags_symptom` (mảng string), `image_url`.
- [ ] 2. `controllers/product.controller.js`: Viết các hàm CRUD (Tạo, Đọc, Cập nhật, Xóa) và một hàm `searchBySymptom` đặc biệt để AI Service gọi sang.
- [ ] 3. `routes/product.routes.js`: Định nghĩa các endpoints RESTful (VD: `GET /api/v1/products`) và map với controller.
- [ ] 4. `app.js` & `server.js`: Khởi tạo Express app, kết nối MongoDB Atlas, gắn các routes và bật CORS.
- [ ] 5. `tests/product.test.js`: Tự động sinh file Unit Test bằng Jest + Supertest theo đúng chuẩn V-Model.

**RÀNG BUỘC:** - Phải bắt lỗi `try...catch` ở mọi controller. Trả về format JSON chuẩn: `{ success: boolean, message: string, data: any }`.
