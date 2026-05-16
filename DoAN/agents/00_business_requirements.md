# 00_business_requirements.md (Hiến pháp Nghiệp vụ - PRD v2.1)

## 1. 🏗️ Kiến trúc & Ngôn ngữ (Tech Stack Guidance)

> **Lưu ý cho AI**: Ưu tiên sử dụng stack React (Vite) + Node.js (Express/NestJS) + MongoDB Atlast. Code theo phong cách Modular Monolith hoặc Clean Architecture để dễ dàng tách microservices sau này.

- **Frontend**: Tailwind CSS + Lucide Icons.
- **State Management**: Ưu tiên Zustand hoặc React Context.
- **Authentication**: JWT (JSON Web Token) lưu tại HttpOnly Cookie.

## 2. 🌐 Phân vùng Hệ thống (Portals)

Hệ thống gồm 2 ứng dụng web chia sẻ cùng một tài nguyên hình ảnh và Database:

- **Storefront (Client)**: `D:\Seminar_git\Seminar_ChuyenDe_nhom\DoAN\Frontend/`. Tập trung vào trải nghiệm mua hàng nhanh và tin cậy.
- **Admin Portal (Back-office)**: `D:\Seminar_git\Seminar_ChuyenDe_nhom\DoAN\Admin`. Tập trung vào quản lý dữ liệu và xử lý nghiệp vụ dược.

## 3. 🔐 Ma trận Phân quyền & Bảo mật (RBAC & Security)

| Vai trò (Actor) | Portal | Quyền hạn đặc trưng | Ràng buộc bảo mật |
| --- | --- | --- | --- |
| **Khách hàng** | Storefront | Upload Rx (Toa thuốc), Thanh toán đơn hàng. | Không thể xem API của `/admin/*`. |
| **Dược sĩ** | Admin | Soạn báo giá, Duyệt toa thuốc, Kiểm kho. | Không có quyền xóa sản phẩm hoặc xem doanh thu tổng. |
| **Admin** | Admin | Quản lý nhân sự, Cấu hình hệ thống, AI Analytics. | Yêu cầu 2FA (Mô phỏng) cho các thao tác nhạy cảm. |

## 4. 🔄 State Machine: Luồng Đơn hàng (Order Statuses)

> **AI Agent cần tuân thủ nghiêm ngặt các trạng thái này khi viết Logic Backend:**

- **`DRAFT_RX`**: Khách đã gửi ảnh toa thuốc, chờ Dược sĩ.
- **`QUOTED`**: Dược sĩ đã nhặt thuốc và gửi giá cho khách.
- **`PENDING_PAYMENT`**: Khách đã xác nhận báo giá, chờ thanh toán.
- **`PROCESSING`**: Đã thanh toán, đang đóng gói tại kho.
- **`SHIPPING`**: Đơn vị vận chuyển đã lấy hàng.
- **`COMPLETED`**: Giao hàng thành công.
- **`CANCELLED`**: Đơn bị hủy (kèm lý do: Toa không hợp lệ, Hết hàng, Khách hủy).

## 5. 📖 User Stories & Logic Chi Tiết (Nâng cao)

### Epic 1: Xác thực & Bảo mật

**US1.1 (OTP Simulation):**
- Tại Storefront, khi khách nhập SĐT, Backend trả về mã `123456` trong payload API (để dễ test).
- Frontend hiển thị thông báo "Mã OTP đã gửi (Test: 123456)".

**US1.2 (Role-based Routing):**
- Hệ thống phải có Middleware kiểm tra role từ Token.
- Nếu ngưới dùng cố tình truy cập `/admin` bằng tài khoản Customer, trả về lỗi 403 và redirect về trang chủ.

### Epic 2: Luồng Toa thuốc (Prescription Workflow)

**US2.1 (Upload & OCR Mock):**
- Khi khách upload ảnh, hệ thống lưu ảnh vào folder `/uploads`.
- Hiển thị trạng thái "Đang xử lý AI" (mô phỏng 2 giây) trước khi chuyển trạng thái sang `DRAFT_RX`.

**US2.2 (Split-screen Admin):**
- Giao diện Dược sĩ duyệt đơn phải là dạng 2 cột:
  - **Trái**: Ảnh toa thuốc (có khả năng zoom/xoay).
  - **Phải**: Form tìm kiếm thuốc trong Database + Nút "Thêm vào báo giá".

**US2.3 (Báo giá & Khớp tồn kho):**
- Khi Dược sĩ thêm thuốc vào báo giá, hệ thống phải check tồn kho (`stock_quantity`).
- Nếu `stock < requested`, hiển thị cảnh báo vàng nhưng vẫn cho phép báo giá (để nhập hàng sau).

### Epic 3: Ràng buộc thuốc Kê đơn (Rx Constraints)

> **Quy tắc cứng:** Bất kỳ sản phẩm nào có flag `is_prescription: true` trong DB thì:

- Không thể bấm nút "Thanh toán ngay" từ Giỏ hàng.
- Bắt buộc phải thông qua luồng "Gửi toa thuốc" ở Epic 2.
- Nếu trong giỏ hàng có cả thuốc thường và thuốc Rx, hệ thống yêu cầu tách đơn hoặc yêu cầu toa thuốc cho toàn bộ giỏ hàng.

## 6. 🛠️ Ràng buộc Kỹ thuật & Giả định (Global Rules)

- **Dữ liệu hình ảnh**: Sử dụng cloudinary để lưu ảnh sản phẩm và toa thuốc. 
- **Thanh toán**: Chỉ implement phương thức COD (Thanh toán khi nhận hàng) và Mô phỏng chuyển khoản (Hiển thị QR Code tĩnh).
- **Thông báo (Notifications)**: Sử dụng luồng Long Polling hoặc đơn giản là hiển thị thông báo khi ngưới dùng F5 trang (Mô phỏng Realtime).
- **AI Consultant**: nhận vào ID đơn hàng và trả về chuỗi text gợi ý (VD: "Khách hàng này thường mua Vitamin C kèm với thuốc cảm").
