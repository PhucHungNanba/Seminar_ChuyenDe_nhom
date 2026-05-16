# 05_devops_agent.md (Kỹ sư Triển khai & Tự động hóa v3.0 - No-n8n Version)

## 🎯 1. Nhiệm vụ & Vai trò

Chịu trách nhiệm đóng gói (Containerization) hệ thống Microservices và thiết lập môi trường chạy ổn định bằng Docker Compose. Thay vì dùng công cụ bên thứ ba, các tác vụ tự động hóa sẽ được tích hợp trực tiếp vào logic của từng dịch vụ để tối ưu thời gian triển khai.

- **Ngữ cảnh:** Phải nạp `03_backend_agent.md` để nắm rõ cổng (Port) của 4 Microservices.
- **Công cụ:** Docker, Docker Compose, MongoDB Atlas.

## 🐳 2. Chiến lược Containerization (Docker)

Hệ thống sẽ được vận hành thông qua các Container độc lập để đảm bảo không bị xung đột môi trường.

### 2.1 Cấu hình Docker Compose (`docker-compose.yml`)

Tệp này nằm tại thư mục gốc để điều phối toàn bộ dự án:

**Mạng nội bộ (Internal Network):** Thiết lập `doan-network` để các dịch vụ giao tiếp qua tên (VD: `order-service` có thể gọi `product-service`).

**Dịch vụ triển khai:**
- **Frontend & Admin:** Chạy trên môi trường Nginx sau khi đã build.
- **Microservices:** `auth-service` (5001), `product-service` (5002), `order-service` (5003), `ai-service` (5004).

**Biến môi trường:** Quản lý tập trung qua file `.env` (chứa `MONGODB_URI`, `JWT_SECRET`).

## ⚙️ 3. Tự động hóa nội bộ (Internal Automation thay cho n8n)

Thay vì dùng workflow ngoài, AI Agent sẽ thực hiện các tác vụ tự động bằng `node-cron` ngay trong Backend:

**Thông báo Telegram (Order Service):**
- Viết một hàm `sendTelegramNotify()` gọi trực tiếp API của Telegram Bot khi có đơn `DRAFT_RX` mới.

**Lập lịch phân tích AI (AI Service):**
- Sử dụng `node-cron` chạy định kỳ vào 0 giờ mỗi ngày để quét lịch sử đơn hàng và cập nhật `AssociationRules`.

**Auto-Restock (Product Service):**
- Tự động reset số lượng tồn kho cho các sản phẩm demo nếu chúng giảm xuống dưới mức tối thiểu (phục vụ mục đích Seminar).

## 🧪 4. Kịch bản Kiểm thử & Vận hành (MVP Testing)

Đảm bảo các dịch vụ "nói chuyện" được với nhau suôn sẻ:

**Health Check:** Kiểm tra trạng thái hoạt động của từng service thông qua endpoint `GET /health`.

**E2E Rx Flow:** Kiểm tra luồng dữ liệu từ khi khách upload ảnh ở Frontend -> Order Service lưu trữ -> Admin Portal hiển thị đúng ảnh đơn thuốc đó.

**Cross-Service Validation:** Đảm bảo khi một đơn hàng hoàn tất, Order Service gọi thành công sang Auth Service để cộng điểm thưởng.

## 🚀 5. Quy trình Triển khai nhanh (Vibe Deploy)

Để đẩy nhanh tiến độ, AI Agent cần chuẩn bị sẵn một script `setup.sh` hoặc file `Makefile` để thực hiện:

1. `docker-compose down -v` (Xóa bỏ container cũ).
2. `docker-compose up --build -d` (Build lại và chạy ngầm toàn bộ hệ thống).
3. `npm run seed` (Đổ dữ liệu mẫu vào MongoDB Atlas ngay sau khi hệ thống sẵn sàng).
