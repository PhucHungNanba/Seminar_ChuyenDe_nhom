# 03_backend_agent.md (Kỹ sư Microservices & API v3.0)

## 🎯 1. Vai trò & Nhiệm vụ

Xây dựng hệ thống Backend dựa trên kiến trúc Microservices. Chia nhỏ hệ thống thành các dịch vụ độc lập để tối ưu hóa việc mở rộng và giúp AI Agent sinh code tập trung hơn vào từng module.

- **Ngữ cảnh:** Phải đọc `00_master_system.md` và `00_business_requirements.md`.
- **Tech Stack:** Node.js (Express), MongoDB (Mongoose), Redis (Caching), Docker.

## 🏗️ 2. Phân tách Dịch vụ (Service Decomposition)

Hệ thống được chia thành 4 dịch vụ chính, mỗi dịch vụ chạy trên một cổng (Port) riêng biệt:

| Dịch vụ (Service) | Port | Chức năng chính |
| --- | --- | --- |
| **Auth Service** | 5001 | Quản lý User, Đăng nhập OTP, Phân quyền (RBAC), JWT. |
| **Product Service** | 5002 | Quản lý danh mục, Kho hàng (Inventory), Sản phẩm OTC/Rx. |
| **Order Service** | 5003 | Xử lý đơn hàng, Luồng trạng thái đơn Rx, Upload toa thuốc. |
| **AI & Analytics** | 5004 | Chạy thuật toán Market Basket Analysis, Gợi ý mua kèm. |

## 🔄 3. Cơ chế Giao tiếp & API Gateway

**API Gateway (Nginx hoặc Node Gateway):** Tiếp nhận mọi request từ Frontend/Admin và điều hướng (proxy) đến đúng dịch vụ tương ứng.

**Giao tiếp liên dịch vụ (Inter-service):** Sử dụng REST hoặc Message Queue (RabbitMQ/Kafka) để xử lý các tác vụ không đồng bộ (Ví dụ: Order hoàn tất -> Gửi tín hiệu sang Auth Service để cộng điểm thưởng).

## 📂 4. Logic Nghiệp vụ Đặc thù theo Microservices

### 4.1 Luồng trạng thái đơn hàng (Order Service)

- Tiếp nhận ảnh đơn thuốc, lưu trữ và chuyển trạng thái đơn sang `DRAFT_RX`.
- Khi trạng thái chuyển sang `PROCESSING`, Order Service phải gọi API sang Product Service để trừ tồn kho theo thời gian thực.

### 4.2 Hệ thống Điểm thưởng (Auth Service)

- Lắng nghe sự kiện `ORDER_COMPLETED` từ Order Service.
- Thực hiện logic cộng 1% giá trị đơn hàng vào `reward_points` của người dùng.
- Endpoint kiểm tra số dư điểm trước khi thanh toán: `GET /api/auth/points/:userId`.

### 4.3 Market Basket Analysis (AI Service)

- Định kỳ quét lịch sử đơn hàng từ Database của Order Service để tính toán các cặp sản phẩm mua kèm thường xuyên.
- Lưu kết quả vào Collection `AssociationRules` để trả về cho Frontend nhanh chóng.

## 🛡️ 5. Middleware & Bảo mật tập trung

**Shared Auth Library:** Một middleware dùng chung để giải mã JWT và kiểm tra quyền (`roleCheck`) cho tất cả dịch vụ.

**CORS Configuration:** Chỉ cho phép Frontend và Admin Portal đã định nghĩa trong `00_master_system.md` truy cập.

## 📡 6. Quy chuẩn Phản hồi liên dịch vụ

Mọi phản hồi giữa các dịch vụ và trả về khách hàng phải nhất quán:

```json
{
  "success": true,
  "service": "order-service",
  "data": { ... },
  "message": "Action completed"
}
```
