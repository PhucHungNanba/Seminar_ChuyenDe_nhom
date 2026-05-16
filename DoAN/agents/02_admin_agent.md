# 02_admin_agent.md (Kỹ sư Giao diện Quản trị - Back-office v3.0)

## 🎯 1. Nhiệm vụ & Vai trò

Tiếp quản, duy trì và mở rộng hệ thống Admin Portal tại thư mục `/Admin`.

Nhiệm vụ trọng tâm hiện tại là **Bổ sung các tính năng quản trị đang bị thiếu hụt** (Quản lý người dùng & Xuất báo cáo) dựa trên nền tảng UI hiện có, đồng thời duy trì tính ổn định của các module đã hoàn thiện (Rx Approval, Inventory, Analytics).

- **Ngữ cảnh bắt buộc:** Phải đọc `00_business_requirements.md` (RBAC) và `00_master_system.md` (Tech stack).
- **Tech Stack:** React 18, Tailwind CSS, Zustand, Recharts, Lucide React.

## 🚨 2. Kế hoạch Bổ sung Tính năng (Gap Analysis & Action Plan)

Hệ thống hiện tại đang thiếu 2 chức năng cốt lõi. AI Agent có nhiệm vụ ưu tiên thực thi các task sau:

### Task 2.1: Bổ sung Module "Quản lý Người dùng" (User Management)

**Tạo trang mới:** Tạo thư mục và file tại `/src/pages/Users/UserManagementPage.tsx`.

**Cập nhật Layout:** Mở file `/src/components/layout/AdminLayout.tsx`, bổ sung menu "Quản lý Người dùng" (dùng icon `Users` từ `lucide-react`) vào Sidebar, nằm dưới mục "Quản lý Đơn hàng".

**Giao diện Page:**
- Xây dựng một Data Table hiển thị danh sách tài khoản (Mock data).
- Các cột cần có: Họ Tên, Email, Vai trò (Admin, Pharmacist, Customer), Trạng thái (Active/Banned), Ngày tạo.
- Cung cấp tính năng: Tìm kiếm theo tên/email, Lọc theo Vai trò.
- **Action (Hành động):** Nút Edit (Đổi role) và nút Ban/Unban user.

### Task 2.2: Bổ sung "Xuất thống kê doanh thu" tại Analytics

**Vị trí:** Truy cập file `/src/pages/Analytics/AnalyticsDashboardPage.tsx`.

**Cập nhật UI:** Cạnh Dropdown chọn thời gian ("7 ngày qua"), thêm một nút "Xuất báo cáo" (Export) sử dụng icon `Download` của `lucide-react`. Nút bấm dùng style outline hoặc secondary để không lấn át giao diện chính.

**Xử lý Logic (Mock):**
- Viết hàm `handleExportData()`.
- Khởi tạo chức năng tạo file CSV mô phỏng từ dữ liệu biểu đồ doanh thu đang hiển thị trên màn hình.
- Khi bấm tải xuống, hiển thị một Toast notification: "Đang xuất dữ liệu báo cáo...".

## 📂 3. Duy trì Các Module Hiện Tại

> **Tuyệt đối không làm hỏng các luồng đang hoạt động tốt:**

- **RxApprovalPage.tsx:** Luôn giữ giao diện split-screen (Trái: Ảnh toa thuốc, Phải: Form báo giá). Kết nối chặt chẽ với `adminRxStore.ts`.
- **InventoryManagementPage.tsx:** Duy trì bảng quản lý kho, tính năng Inline-edit để chỉnh sửa số lượng kho nhanh.
- **AnalyticsDashboardPage.tsx:** Giữ nguyên bố cục thẻ thống kê và phần "Insight Khai phá Dữ liệu" (Market Basket Analysis) như thiết kế ban đầu.

## 🎨 4. Tiêu chuẩn UI/UX (Back-office Vibe)

**Phong cách:** Giao diện phẳng, chuyên nghiệp, tối giản.

**Bảng màu hệ thống:**
- Tuân thủ màu Navy Blue của Sidebar.
- Nền trang xám nhạt (`bg-slate-50`).
- Các thẻ Card màu trắng có đổ bóng nhẹ (`shadow-sm`, `rounded-xl`).

**Thành phần dùng chung:** Tận dụng tối đa các component đã có trong `/src/components/layout`. Không tự ý thêm thư viện UI component mới (như MUI hay AntD) để tránh làm phình source code.
