# 00_business_requirements.md (Hiến pháp Nghiệp vụ - PRD v2.0)

## 1. 🌐 Phân vùng Hệ thống & Điểm Truy cập (Portals)
Hệ thống được chia làm 2 ứng dụng (phân vùng) độc lập về mặt giao diện, dùng chung 1 backend:
- **Storefront (Web Khách hàng - pharma.com)**: Nơi khách hàng vãng lai và thành viên truy cập.
- **Admin Portal (Web Quản trị - pharma.com/admin)**: Khu vực đóng, bắt buộc phải có tài khoản nội bộ (Dược sĩ/Quản trị viên) mới được truy cập.

## 2. 🔐 Ma trận Phân quyền (RBAC Matrix)

| Vai trò (Actor) | Cổng đăng nhập | Quyền hạn (Permissions) | Giới hạn (Restrictions) |
| --- | --- | --- | --- |
| **Khách hàng** | Storefront | Tạo đơn, Upload toa thuốc, Xem lịch sử cá nhân. | Không thể truy cập `/admin`. |
| **Dược sĩ** | Admin Portal | Đọc toa thuốc khách gửi, Tạo báo giá (Quote), Cập nhật trạng thái đơn hàng. | KHÔNG xem được Báo cáo doanh thu, KHÔNG quản lý được tài khoản nhân sự. |
| **Quản trị viên** | Admin Portal | Toàn quyền. Xem Dashboard tài chính, Quản lý Tồn kho đa điểm, Phân quyền nhân viên. | (Không có giới hạn nội bộ) |

## 3. 📖 User Stories Chi Tiết (Bao gồm Hành vi & Phản hồi Hệ thống)
> **Lưu ý cho AI Agent**: Khi implement các chức năng dưới đây, bắt buộc tuân thủ đúng Cổng truy cập và System Response đã mô tả.

### Epic 1: Xác thực & Điều hướng (Authentication & Routing)
**US1.1 - Đăng nhập Khách hàng:**
- **Actor & Portal**: Khách hàng tại Storefront.
- **Hành động**: Nhập SĐT và OTP (Mô phỏng) tại trang chủ.
- **System Response**: Trả về token, đổi trạng thái UI sang "Đã đăng nhập", giữ người dùng lại trang hiện tại (không redirect đi đâu).

**US1.2 - Đăng nhập Nội bộ (Nhân viên):**
- **Actor & Portal**: Dược sĩ / Admin tại Admin Portal (`/admin`).
- **Hành động**: Nhập Email nội bộ và Password.
- **System Response**:
  - Hệ thống kiểm tra role trong token.
  - Nếu là Role `Pharmacist` -> Redirect về `/admin/rx-approval` (Trang duyệt đơn). Ẩn menu Báo cáo.
  - Nếu là Role `Admin` -> Redirect về `/admin/dashboard` (Trang tổng quan doanh thu). Hiển thị full menu.

### Epic 2: Luồng Kê Đơn Mở (Open Prescription Flow - Critical O2O)
**US2.1 - Gửi yêu cầu mua theo toa:**
- **Actor & Portal**: Khách hàng tại Storefront.
- **Hành động**: Bấm "Gửi toa thuốc" -> Upload ảnh chụp -> Điền SĐT -> Bấm "Gửi yêu cầu".
- **System Response**: Lưu DB với status: `DRAFT_RX`. Hiển thị màn hình Success: "Dược sĩ đang kiểm tra toa thuốc, vui lòng đợi tin nhắn xác nhận".

**US2.2 - Nhận diện và Xử lý toa thuốc (Split-screen):**
- **Actor & Portal**: Dược sĩ tại Admin Portal.
- **Hành động**: Truy cập tab "Chờ duyệt", bấm vào ticket `DRAFT_RX` mới nhất. Nhìn ảnh toa thuốc bên trái, dùng thanh search bên phải tìm thuốc trong kho và thêm vào giỏ. Bấm "Gửi báo giá".
- **System Response**: Update ticket thành status: `PENDING_PAYMENT`. Hệ thống tự động đẩy một thông báo (Notification) sang tài khoản của Khách hàng trên Storefront.

**US2.3 - Khách hàng chốt đơn & Thanh toán:**
- **Actor & Portal**: Khách hàng tại Storefront.
- **Hành động**: Bấm vào thông báo "Toa thuốc đã được báo giá", xem lại danh sách thuốc Dược sĩ đã nhặt và tổng tiền. Bấm "Thanh toán".
- **System Response**: Khởi tạo luồng Checkout, trừ Tồn kho (Inventory), cộng Điểm thưởng (PharmaPoints), chuyển trạng thái đơn thành `PROCESSING`.

### Epic 3: Giao dịch thông thường & Ràng buộc (Standard Cart & Constraints)
**US3.1 - Chặn thanh toán thuốc Rx:**
- **Actor & Portal**: Khách hàng tại Storefront.
- **Hành động**: Bỏ một thuốc có nhãn `Rx` vào giỏ hàng và bấm "Thanh toán" ngay lập tức mà không up ảnh toa thuốc hợp lệ.
- **System Response**: Backend từ chối request. Frontend hiển thị Modal báo lỗi màu đỏ: "Vui lòng đính kèm ảnh toa thuốc cho các sản phẩm Kê đơn (Rx) trước khi tiếp tục", đồng thời disable nút Thanh toán.

### Epic 4: Quản trị Vận hành & Dữ liệu (Admin Operations)
**US4.1 - Quản lý tồn kho đa điểm:**
- **Actor & Portal**: Quản trị viên tại Admin Portal.
- **Hành động**: Truy cập bảng "Tồn kho", sửa trực tiếp (inline edit) số lượng thuốc Amoxicillin tại chi nhánh "Quận 1" từ 10 thành 0.
- **System Response**: Lưu DB. Khi Khách hàng ở Storefront tìm thuốc Amoxicillin, hệ thống tự động hiển thị "Hết hàng tại Quận 1 - Chuyển giao từ Kho Tổng".

**US4.2 - Khai phá dữ liệu (Data Mining):**
- **Actor & Portal**: Quản trị viên tại Admin Portal.
- **Hành động**: Truy cập tab "Phân tích AI".
- **System Response**: Hệ thống query dữ liệu hóa đơn, chạy thuật toán (mô phỏng) và hiển thị biểu đồ danh sách các quy tắc kết hợp (VD: Mua Thuốc Ho -> 80% mua kèm Kẹo ngậm). Cung cấp nút "Kích hoạt luật này lên Storefront".
