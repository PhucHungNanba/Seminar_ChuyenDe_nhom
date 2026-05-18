# 🤖 PHASE 3: USER SERVICES GENERATION

**CONTEXT:** Xây dựng microservices độc lập: `user-service` (Port 3001). Sử dụng Node.js, Express, Mongoose.

**TASKS CHO AI - PHẦN USER SERVICE (`user-service`):**
- [ ] 1. `models/User.js`: Lược đồ gồm `email`, `password` (đã hash), `fullName`, `role` (user/admin), `phone`.
- [ ] 2. `controllers/auth.controller.js`: 
    - Hàm `register`: Mã hóa mật khẩu bằng `bcrypt`.
    - Hàm `login`: Kiểm tra mật khẩu, sinh ra và trả về `JWT Token`.
- [ ] 3. `middlewares/auth.js`: Middleware `verifyToken` để giải mã JWT, chặn các request không có token hợp lệ.
- [ ] 4. Khởi tạo `app.js` và `routes` liên quan.
