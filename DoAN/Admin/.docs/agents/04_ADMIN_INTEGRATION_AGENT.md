# 🤖 PHASE 4: MICROSERVICES INTEGRATION

**CONTEXT:** Kết nối Admin Frontend với hệ thống Backend Microservices thực tế.

**TASKS CHO AI:**
- [ ] 1. Thiết lập HTTP Client (Axios) có interceptor, đảm bảo mọi request đều chứa JWT Token của Admin.
- [ ] 2. Trang Inventory: Kết nối với Endpoint của `Product Service` (VD: `GET /api/products`, `POST /api/products`) để lấy/sửa dữ liệu thuốc thật.
- [ ] 3. Trang RxApproval: Kết nối với Endpoint của `Order Service` hoặc `AI Service` để lấy danh sách đơn thuốc OCR cần người duyệt cuối cùng.
- [ ] 4. Trang Dashboard: Gọi API Gateway để lấy các con số tổng hợp từ nhiều Service khác nhau.

**RÀNG BUỘC (CONSTRAINTS):**
- Bắt buộc xử lý lỗi 401/403: Nếu Token hết hạn hoặc không có quyền, tự động đá Admin văng về trang Đăng nhập.
- Thêm Loading Skeleton hoặc Spinner khi chờ data từ Backend.
