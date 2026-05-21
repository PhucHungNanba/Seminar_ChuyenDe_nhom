# skills_phase4.md (Định nghĩa Công nghệ & Thư viện Nghiệp vụ)

Tài liệu này quy định danh sách các công cụ, middleware và thư viện kiểm thử nâng cao được sử dụng trong suốt **Phase 4: Triển khai Tính năng & Kiểm thử vi mô** nhằm xử lý các nghiệp vụ phức tạp liên quan đến giỏ hàng, tải ảnh y tế lên đám mây và kiểm thử tích hợp.

---

## 1. 💾 State Persistence (Lưu trữ trạng thái phía Client)
- **Library:** `Zustand`.
- **RÀNG BUỘC KỸ THUẬT BẮT BUỘC:**
  - Ở phía Storefront, bắt buộc sử dụng **Zustand Persistence Middleware (`persist` middleware)** để tự động đồng bộ và lưu trữ trạng thái Giỏ hàng (`cartState`) vào `LocalStorage` của trình duyệt.
  - Đảm bảo khi người dùng tải lại trang (F5) hoặc vô tình đóng trình duyệt, danh sách sản phẩm trong giỏ hàng và trạng thái đính kèm toa thuốc (`prescriptionId`) không bị mất dữ liệu.

## ☁️ 2. Multipart Data & CDN Handling (Xử lý tệp tin đa định dạng & Đám mây)
- **Multipart Parser:** `Multer` (để phân tách luồng dữ liệu nhị phân của hình ảnh đơn thuốc gửi từ form-data client).
- **Cloud Storage SDK:** `Cloudinary` Node.js SDK.
- **RÀNG BUỘC PHƯƠNG THỨC UPLOAD:**
  - Tuyệt đối cấm ghi đè ảnh trực tiếp lên đĩa cục bộ của container server (Local storage) để tránh làm nặng dung lượng ổ đĩa.
  - Sử dụng cơ chế truyền luồng dữ liệu **`cloudinary.uploader.upload_stream()`** của SDK để stream dữ liệu nhị phân của ảnh trực tiếp từ bộ nhớ đệm Buffer của Express lên Cloudinary, nhận về URL bảo mật `secure_url`.

## 🧪 3. Integration Testing (Kiểm thử Tích hợp toàn diện)
- **Framework:** `Jest` kết hợp với thư viện **`supertest`** ở Backend.
- **Mục tiêu kiểm thử:**
  - Tạo các kịch bản kiểm thử giả lập các cuộc gọi API từ Client bắn trực tiếp vào Express endpoints.
  - Bắn các payload dữ liệu bị khuyết thiếu trường (Ví dụ: đặt hàng thuốc Rx không truyền `prescriptionId`) hoặc định dạng sai để kiểm chứng cơ chế bắt lỗi và trả về mã lỗi (`HTTP 400 Bad Request`, `HTTP 401 Unauthorized`) hoạt động chuẩn xác theo thiết kế Error Handling.
