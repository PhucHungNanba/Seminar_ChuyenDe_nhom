# 2_INFRA_AND_DEPLOYMENT.md

## 1. Cơ sở dữ liệu (Database)

Hệ thống lưu trữ trên **MongoDB Atlas Cloud**.
- **Quy tắc cốt lõi**: Phải tuân thủ mô hình **Database per Service**. Mỗi Microservice phải độc lập quản lý một Logical Database riêng rẽ nhằm tránh điểm kẹt nút cổ chai (Bottleneck).
  - `user-service` kết nối vào db: `medicine_users`
  - `product-service` kết nối vào db: `medicine_products`
  - `order-service` kết nối vào db: `medicine_orders`

## 2. Tiêu chuẩn Biến môi trường (.env)

Mỗi service phải có file `.env` riêng biệt, không được chia sẻ file `.env` chung nhằm tính đóng gói cao nhất. Cấu trúc chuẩn:

```env
# Cổng chạy ứng dụng
PORT=300X

# Đường dẫn DB tách riêng
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/<TEN_DB_RIENG>?retryWrites=true&w=majority

# Các khóa bí mật khác
JWT_SECRET=super_secret_key
GEMINI_API_KEY=ai_key
```

## 3. Kịch bản Tự động hóa (GitHub Actions CI/CD)

Nếu cấu hình `.github/workflows/main.yml`, quá trình CI/CD sẽ có 2 Pipeline chính:
1. **Continuous Integration (CI):** Khi code được đẩy lên nhánh `main`, quy trình sẽ cấp phát runner để tải dependencies, sau đó tự động chạy lệnh test (`npm test` cho Node và `pytest` cho Python) trên tất cả các dịch vụ.
2. **Continuous Deployment (CD):** Nếu CI pass xanh, workflow sẽ tiến hành Build thành Docker Image rồi Push lên Registry, từ đó Server VPS/Cloud sẽ kéo về và reload Container.
