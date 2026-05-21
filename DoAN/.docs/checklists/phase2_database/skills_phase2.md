# skills_phase2.md (Định nghĩa Công nghệ Backend Core)

Tài liệu này thiết lập "bức tường lửa" về công nghệ cho Backend trong suốt **Phase 2: Thiết kế Database & Móng Backend**. Mọi hoạt động phát triển phải tuân thủ nghiêm ngặt các quy định dưới đây.

---

## 1. 🗄️ Database & ODM (Cơ sở dữ liệu)
- **Database Engine:** `MongoDB Atlas` (CSDL NoSQL dạng Document Cloud).
- **ODM (Object Data Modeling):** `Mongoose`.
- **RÀNG BUỘC KẾT NỐI BIỆT LẬP (Microservices DB Isolation):** 
  - Hệ thống áp dụng cô lập cơ sở dữ liệu ở tầng vật lý cho từng microservice.
  - Mỗi microservice chịu trách nhiệm kết nối riêng tới database của chính mình và cấm truy cập database của service khác:
    - **`user-service`** kết nối tới database `db_users`.
    - **`product-service`** kết nối tới database `db_products`.
    - **`order-service`** kết nối tới database `db_orders`.

## 🛡️ 2. Data Validation (Xác thực dữ liệu)
- Không cài đặt thêm các thư viện validate bên ngoài như `Joi`, `Yup`, hay `class-validator` trừ khi có yêu cầu đặc biệt.
- **Bắt buộc sử dụng trực tiếp built-in validation của Mongoose** trong định nghĩa Schema:
  - Kiểu String: `required`, `enum`, `trim`, `minlength`, `maxlength`.
  - Kiểu Number: `min`, `max`, `required`.
  - Thiết lập các thông điệp báo lỗi (custom error messages) rõ nghĩa bằng Tiếng Việt để hiển thị trực tiếp lên UI client.

## 🧪 3. Testing Framework (Khung kiểm thử)
- **Framework kiểm thử:** `Jest` kết hợp với `ts-jest` để hỗ trợ chạy trực tiếp các bộ test viết bằng TypeScript.
- **Mục tiêu kiểm thử:** Thực hiện Unit Test kiểm tra tính toàn vẹn của Mongoose Model Validation (bắt lỗi thiếu trường, bắt lỗi sai Enum...).

---

## 🚫 LUẬT CẤM TUYỆT ĐỐI (Strict Red Lines)
- Tuyệt đối không sử dụng các hệ quản trị CSDL quan hệ (như MySQL, PostgreSQL, MS SQL Server).
- Tuyệt đối cấm sử dụng các công cụ ORM khác như `Sequelize`, `Prisma`, `TypeORM`.
