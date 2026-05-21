# skills_phase5.md (Định nghĩa Công nghệ Tích hợp & Tối ưu)

Tài liệu này quy định danh sách các công cụ, thư viện cấu hình và quy chuẩn tối ưu hóa mã nguồn trong suốt **Phase 5: Tích hợp API, Dọn dẹp & Tối ưu (Refinement)** nhằm đảm bảo hệ thống PharmaCare sẵn sàng vận hành thực tế ổn định và đạt hiệu năng tối đa.

---

## 1. 🌐 API Client & Authorization Interceptors (Giao tiếp & Xác thực)
- **Library:** `Axios`.
- **RÀNG BUỘC KỸ THUẬT BẮT BUỘC:**
  - Triển khai **Axios Interceptors** cho cả hai ứng dụng Storefront và Admin Portal:
    - **Request Interceptor:** Tự động chèn mã xác thực **JWT Token** (đọc từ LocalStorage/Cookie) vào Header `Authorization: Bearer <token>` ở mọi yêu cầu HTTP gửi xuống Backend.
    - **Response Interceptor:** Lắng nghe và xử lý tập trung lỗi xác thực. Nếu Backend trả về mã lỗi `HTTP 401 Unauthorized` (Token hết hạn hoặc không hợp lệ), hệ thống tự động xóa sạch dữ liệu phiên đăng nhập cũ trong Zustand Store và lập tức redirect (chuyển hướng) người dùng về trang Đăng nhập `/login`.

## 💾 2. Data Fetching & State Management (Đồng bộ Trạng thái)
- **Pattern:** Phối hợp chặt chẽ giữa **Axios** và **Zustand**.
- Các thao tác gọi API (HTTP Calls) phải được đóng gói gọn gàng thành các Action bên trong Zustand store tương ứng (Ví dụ: `fetchProducts()`, `addToCart()`). Sau khi API phản hồi thành công, tiến hành cập nhật trực tiếp vào State toàn cục để trigger re-render UI client đồng bộ, sạch sẽ.

## 🚀 3. Optimization & Building Tools (Tối ưu hóa & Đóng gói)
- **Vite Build (Rollup):** Cấu hình tính năng split-chunks (phân tách gói file) trong `vite.config.ts` để chia nhỏ bundle code thành các phần nhẹ hơn, tăng tốc độ tải trang ban đầu.
- **Static Assets Compression:** Sử dụng plugin nén tài nguyên tĩnh (như nén Gzip/Brotli) trước khi triển khai production.
- **Cloudinary Image Optimization:** Ràng buộc tất cả các thẻ `<img>` hiển thị ảnh y tế hoặc sản phẩm lấy từ Cloudinary phải đính kèm tham số **`q_auto,f_auto`** vào đường dẫn URL (Ví dụ: `https://res.cloudinary.com/.../q_auto,f_auto/.../image.jpg`) để tự động tối ưu định dạng (WebP/AVIF) và nén dung lượng ảnh phù hợp với thiết bị người dùng mà không làm giảm chất lượng hiển thị.

---

## 🚫 Quy định về Debugging (Strict Red Line)
- Tuyệt đối cấm để lại các lệnh `console.log`, `console.warn`, hoặc `debugger` trong mã nguồn khi đóng gói build chính thức chạy trên môi trường Production.
