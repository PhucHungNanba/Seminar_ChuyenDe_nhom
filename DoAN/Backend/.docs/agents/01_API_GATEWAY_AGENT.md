# 🤖 PHASE 1: API GATEWAY GENERATION

**CONTEXT:** Xây dựng cổng giao tiếp duy nhất (API Gateway) bằng Node.js và thư viện `http-proxy-middleware`. Thư mục làm việc: `api-gateway`. Port dự kiến: 3000.

**TASKS CHO AI:**
Hãy tạo các file sau:

- [ ] 1. `package.json`: Khởi tạo và cài đặt `express`, `cors`, `http-proxy-middleware`, `morgan` (để log request).
- [ ] 2. `index.js` (File chính):
    - Cấu hình CORS để cho phép Frontend (ví dụ port 5173) và Admin gọi vào.
    - Cấu hình Proxy Routes:
        - `/api/users` -> proxy tới `http://localhost:3001` (User Service)
        - `/api/products` -> proxy tới `http://localhost:3002` (Product Service)
        - `/api/orders` -> proxy tới `http://localhost:3003` (Order Service)
        - `/api/ai` -> proxy tới `http://localhost:8000` (AI Service - FastAPI)
- [ ] 3. `middlewares/errorHandler.js`: Viết hàm middleware bắt lỗi tổng. Nếu một service con bị sập (timeout/refused), Gateway phải trả về lỗi HTTP 503 (Service Unavailable) thay vì crash cả hệ thống.

**RÀNG BUỘC (CONSTRAINTS):**
- API Gateway tuyệt đối KHÔNG chứa logic nghiệp vụ (như query database hay tính toán). Chỉ làm nhiệm vụ forward (chuyển tiếp) request.
