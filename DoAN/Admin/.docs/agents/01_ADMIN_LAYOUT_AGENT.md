# 🤖 PHASE 1: ADMIN LAYOUT & NAVIGATION

**CONTEXT:** Xây dựng khung giao diện chung cho phân hệ Admin tại thư mục `src/components/layout/`.

**TASKS CHO AI:**
Hãy sinh code cho file sau:

- [ ] 1. `AdminLayout.tsx`: 
    - Tạo một bố cục gồm: Sidebar bên trái (cố định) và Content Area bên phải.
    - Sidebar chứa các menu items: Tổng quan, Phê duyệt Đơn thuốc, Quản lý Kho, Thống kê. Sử dụng `lucide-react` cho các icon tương ứng.
    - Topbar chứa: Thông tin Admin đăng nhập, nút Đăng xuất, và Thông báo (Notification bell).
    - Content Area sử dụng `<Outlet />` của `react-router-dom` để render các trang con.

**RÀNG BUỘC (CONSTRAINTS):**
- Sidebar có thể thu gọn/mở rộng (Toggle) trên màn hình nhỏ.
- Tone màu Sidebar nên tối (Dark theme, ví dụ `slate-900`) để phân biệt rõ với giao diện Frontend của khách hàng.
