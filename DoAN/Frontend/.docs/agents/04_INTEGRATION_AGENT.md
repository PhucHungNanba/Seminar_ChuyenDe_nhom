# 🤖 PHASE 4: AI & BACKEND API INTEGRATION

**CONTEXT:** Xóa các mock data và kết nối với Backend Microservices (Port 3000) và Gemini API.

**TASKS CHO AI:**
Hãy bổ sung hoặc sửa đổi các file sau:

- [ ] 1. Cấu hình Axios: Tạo `src/api/axiosClient.ts`, tự động gắn `Authorization: Bearer <token>` vào headers. Bắt lỗi 401/403 tự động.
- [ ] 2. Xử lý OCR Đơn thuốc: Trong `rxStore.ts` hoặc file service, viết hàm POST gửi ảnh Base64 lên endpoint `/api/ai/analyze-prescription`. Khi nhận JSON trả về, cập nhật vào store.
- [ ] 3. Giao tiếp Trợ lý Dược sĩ: Cập nhật `PharmacistLiveChat.tsx`, bắt sự kiện `onSend`, gửi text lên `/api/ai/chat` và hiển thị response kiểu streaming hoặc loading message.
- [ ] 4. Tích hợp thanh toán: Gọi endpoint `/api/orders/checkout` trong trang `Checkout/index.tsx` khi bấm nút Đặt hàng.

**RÀNG BUỘC (CONSTRAINTS):**
- Luôn hiển thị Toast Notification (Thông báo thành công/thất bại) cho người dùng khi gọi API xong.
- Sử dụng biến môi trường (Vite: `import.meta.env.VITE_API_URL`) để quản lý endpoint.
