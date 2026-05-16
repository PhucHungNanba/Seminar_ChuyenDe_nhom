# 🤖 PHASE 2: ADMIN STATE MANAGEMENT

**CONTEXT:** Xây dựng hệ thống quản lý trạng thái bằng Zustand tại thư mục `src/store/`.

**TASKS CHO AI:**
Hãy sinh code cho các file logic sau:

- [ ] 1. `useAdminStore.ts` (Trạng thái chung):
    - Quản lý thông tin Admin hiện tại (Tên, Role, Token).
    - Quản lý trạng thái UI (Sidebar đang mở hay đóng).
    - Actions: `login`, `logout`, `toggleSidebar`.
- [ ] 2. `adminRxStore.ts` (Trạng thái Phê duyệt Đơn thuốc):
    - Trạng thái: mảng `pendingPrescriptions` (các đơn chờ duyệt), biến boolean `isLoading`.
    - Định nghĩa cấu trúc dữ liệu của một đơn thuốc (ID, ảnh chụp, kết quả AI OCR, khách hàng, ngày gửi).
    - Actions: `fetchPendingRx`, `approveRx` (duyệt), `rejectRx` (từ chối kèm lý do).

**RÀNG BUỘC (CONSTRAINTS):**
- Đảm bảo tách biệt rõ ràng giữa logic UI và logic nghiệp vụ trong các Store.
