# 01_frontend_agent.md (Kỹ sư Giao diện Khách hàng - Storefront v3.0)

## 🎯 1. Nhiệm vụ & Mục tiêu

Tiếp quản và phát triển ứng dụng Web Client tại thư mục `/Frontend`. Nhiệm vụ trọng tâm là duy trì tính nhất quán của hệ thống, thực thi đúng các nghiệp vụ y tế (Rx/OTC) và tối ưu hóa trải nghiệm "Vibe Long Châu" dựa trên nền tảng kỹ thuật hiện có.

- **Ngữ cảnh bắt buộc:** Tuyệt đối tuân thủ `ARCHITECTURE.md` (Cấu trúc dữ liệu), `00_master_system.md` (Tech stack) và `00_business_requirements.md` (Nghiệp vụ).
- **Ngôn ngữ:** TypeScript (`.tsx`), Tailwind CSS v4, Framer Motion.

## 📂 2. Quản lý Thư mục & "Source of Truth"

> **AI Agent phải luôn tham chiếu các tệp tin nguồn sau đây trước khi chỉnh sửa UI:**

- **Dữ liệu sản phẩm:** `src/data/allProducts.ts` (17 sản phẩm mẫu với đầy đủ flag `otc` và `rx`).
- **Trạng thái giỏ hàng:** `src/store/cartStore.ts` (Xử lý logic `addItem` và `setPrescription`).
- **Dữ liệu Data Mining:** `src/data/mockAssociationRules.ts` (Dùng cho gợi ý mua kèm).

## 🛠️ 3. Các Luồng Nghiệp vụ Hiện hữu (Cần duy trì & Kiểm soát)

### 3.1 Luồng Thuốc Kê đơn (Rx Flow) - Đã có giao diện

Hệ thống hiện tại đã tích hợp sẵn chức năng xử lý toa thuốc. AI cần đảm bảo:

- **CartPage:** Banner cảnh báo Rx phải hiện ra thông qua `AnimatePresence` khi giỏ hàng có thuốc Rx.
- **PrescriptionUploader:** Thành phần này phải xuất hiện tại mỗi `CartItem` thuộc loại `rx` nếu chưa có ảnh toa.
- **Logic Chốt đơn:** Nút "Thanh toán" chỉ được mở khóa (unlocked) khi `rxMissingPrescription.length === 0`.

### 3.2 Luồng Gợi ý Mua kèm (Data Mining UI)

Sử dụng component `FrequentlyBoughtTogether` tại `MedicineDetailPage` và `CartPage`:

- Lấy dữ liệu từ `getRulesForProducts(productIds)`.
- Hiển thị badge "Phổ biến" nếu chỉ số `lift > 2.5`.
- Hiển thị độ tin cậy "N% khách hàng thường mua kèm" dựa trên `confidence`.

### 3.3 Luồng Mua lại từ Vault (Prescription Vault)

Tại trang `/profile`, khi người dùng bấm "Mua lại" từ một đơn thuốc cũ:

- Phải gọi `addItem()` cho từng loại thuốc.
- Sau đó gọi `setPrescription()` để tự động đính kèm ảnh đơn thuốc cũ vào từng item trong giỏ.

## 🎨 4. Tiêu chuẩn UI/UX & Animation (Vibe Long Châu)

**Màu sắc:** Navy Blue (`#003580`), Trắng, Xám.

**Hiệu ứng:**
- Sử dụng `motion.div` với `layout` prop cho các danh sách có thể thay đổi (giỏ hàng, danh sách sản phẩm).
- `AnimatePresence` cho các thông báo lỗi hoặc chuyển đổi giữa nút Thanh toán bị khóa và mở khóa.

**Responsive:** Grid hệ thống sử dụng `auto-fill minmax(210px, 1fr)` để tự động thích ứng.

## 📡 5. Kế hoạch Tích hợp Backend (Dự kiến)

AI Agent sẽ chuẩn bị sẵn sàng để thay thế Mock Data bằng API thực tế theo lộ trình:

- Thay `ALL_PRODUCTS` bằng `GET /api/products`.
- Thay `MOCK_PRESCRIPTIONS` bằng `GET /api/users/me/prescriptions`.
- Bổ sung `persist` middleware vào `cartStore` để lưu giỏ hàng vào LocalStorage.
