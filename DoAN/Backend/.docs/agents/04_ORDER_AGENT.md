# 🤖 PHASE 5: ORDER SERVICES GENERATION

**CONTEXT:** Xây dựng 2 microservices độc lập: `user-service` (Port 3001) và `order-service` (Port 3003). Sử dụng Node.js, Express, Mongoose.

**TASKS CHO AI - PHẦN ORDER SERVICE (`order-service`):**
- [ ] 1. `models/Order.js`: Lược đồ gồm `userId`, `items` (mảng chứa `productId`, `quantity`, `price`), `totalAmount`, `shippingAddress`, `status` (pending/approved/shipped), `prescriptionImageUrl` (nếu có đơn thuốc).
- [ ] 2. `controllers/order.controller.js`: 
    - Hàm `createOrder`: Nhận dữ liệu giỏ hàng. **Lưu ý:** Cần có logic gọi HTTP GET sang `Product Service` để kiểm tra lại giá và số lượng tồn kho (tránh việc Frontend gửi sai giá).
    - Hàm `updateOrderStatus`: Dùng cho Admin duyệt đơn (từ pending -> approved).
- [ ] 3. Khởi tạo `app.js` và `routes` liên quan. Chú ý áp dụng middleware verify JWT (được copy từ user-service sang) để bảo vệ route tạo đơn hàng.

**RÀNG BUỘC (CONSTRAINTS):**
- Password trong database phải được mã hóa.
- Mỗi service phải có kết nối database riêng biệt (Database per Service) trên cùng một MongoDB Atlas Cluster (VD: `db_users` và `db_orders`).
