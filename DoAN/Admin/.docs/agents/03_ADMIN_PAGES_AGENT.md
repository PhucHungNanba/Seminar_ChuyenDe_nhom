# 🤖 PHASE 3: CORE ADMIN PAGES ASSEMBLY

**CONTEXT:** Xây dựng các trang tính năng chính, tích hợp mock data tĩnh để kiểm tra Layout.

**TASKS CHO AI:**
Hãy sinh code tĩnh (Dumb UI) cho các file sau:

- [ ] 1. `Dashboard/DashboardOverview.tsx`: 
    - Hiển thị 4 thẻ thống kê nhanh (Card): Tổng doanh thu, Số đơn hàng mới, Số đơn thuốc chờ duyệt, Cảnh báo sắp hết hạn.
- [ ] 2. `RxApproval/RxApprovalPage.tsx`: 
    - Layout chia 2 cột: Cột trái hiện danh sách đơn chờ duyệt. Cột phải hiện chi tiết (Ảnh đơn thuốc thực tế VS Kết quả dạng text do AI đọc). Có nút "Duyệt đơn" (Màu xanh) và "Từ chối" (Màu đỏ).
- [ ] 3. `Inventory/InventoryManagementPage.tsx`: 
    - Bảng danh sách các loại thuốc (Tên, Số lượng tồn, Giá, Trạng thái).
    - Có thanh tìm kiếm và nút "Thêm thuốc mới".
- [ ] 4. `Analytics/AnalyticsDashboardPage.tsx`: 
    - Tích hợp một thư viện biểu đồ nhẹ (như `recharts` hoặc `chart.js`) để vẽ biểu đồ doanh thu theo tháng và top thuốc bán chạy.

**RÀNG BUỘC (CONSTRAINTS):**
- Sử dụng các Table component đẹp của Tailwind.
- Liên kết state từ `adminRxStore` vào trang `RxApprovalPage`.
