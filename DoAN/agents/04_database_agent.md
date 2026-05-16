# 04_database_agent.md (Kỹ sư Dữ liệu & Quy chuẩn Seed Data v3.0)

## 🎯 1. Nhiệm vụ & Mục tiêu

Thiết kế cấu trúc Database (MongoDB) chi tiết để AI có thể tạo file `seed.ts` trong thư mục D:\Seminar_git\Seminar_ChuyenDe_nhom\DoAN\Seeds chuẩn xác. Dữ liệu không chỉ là tên sản phẩm mà phải bao gồm các thông số y tế, giúp hệ thống vận hành đúng luồng Prescription Workflow và Data Mining.

- **Ngữ cảnh:** Phải khớp với `ARCHITECTURE.md` và `00_business_requirements.md`.
- **Tech Stack:** MongoDB Atlas, Mongoose ODM.

## 📂 2. Hệ thống Collections & Schema Chi tiết

### 2.1 Collection: Categories (Danh mục Nhóm bệnh)

Để AI seed dữ liệu theo nhóm bệnh lý chuyên sâu.

**Fields:** `name` (VD: Kháng sinh, Giảm đau, Tim mạch), `slug`, `description`, `icon`.

### 2.2 Collection: Products (Dược phẩm & Thiết bị)

Đây là "linh hồn" của hệ thống. AI cần seed ít nhất 17 sản phẩm mẫu theo `ARCHITECTURE.md`.

**Core Fields:** `name`, `genericName` (Hoạt chất), `manufacturer`, `type` (otc | rx), `form` (tablet | liquid | capsule | device), `price`, `unit` (Hộp/Vỉ/Viên), `stock_quantity`, `images`: [String] (Mảng URL từ Cloudinary, gồm ảnh chính và ảnh con).

**Medical Tabs (`tabs`):**
- `ingredients`: Thành phần hoạt chất.
- `indications`: Chỉ định điều trị.
- `dosage`: Liều lượng sử dụng.
- `sideEffects`: Tác dụng phụ.

**Inventory Management (Quản lý tồn kho đa chi nhánh):**
Để hiển thị đúng bảng dữ liệu trong Admin Portal, cấu trúc tồn kho cần được phân rã:
inventory: Object (Chứa chi tiết từng kho)  
- 'main_warehouse': Number (Kho Tổng)  
- 'branch_q1': Number (Chi nhánh Quận 1)  
- 'branch_q5': Number (Chi nhánh Quận 5)  
- 'stock_quantity': Number (Tổng tồn kho). Giá trị này sẽ bằng tổng các kho thành phần:stock\_quantity = inventory.main\_warehouse + inventory.branch\_q1 + inventory.branch\_q5

**Constraints:** `is_prescription` (Boolean) - Nếu `true`, bắt buộc phải có ảnh toa mới cho thanh toán.

### 2.3 Collection: Users (Người dùng & Nhân sự)

Phân quyền rõ ràng cho 3 đối tượng.

**Fields:** `phone` (SĐT đăng nhập), `email` (Dành cho Admin/Pharmacist), `password` (Hashed), `role` (Admin | Pharmacist | Customer), `reward_points` (Điểm tích lũy PharmaPoints).

### 2.4 Collection: Orders (Đơn hàng & Toa thuốc)

Lưu trữ lịch sử giao dịch và ảnh toa khách gửi.

**Fields:**
- `customerId`: Ref Users.
- `items`: Danh sách sản phẩm kèm giá tại thời điểm mua.
- `prescriptionImage`: URL ảnh đơn thuốc (lưu tại `/uploads`).
- `status`: `[DRAFT_RX, QUOTED, PENDING_PAYMENT, PROCESSING, SHIPPING, COMPLETED, CANCELLED]`.
- `pharmacistNotes`: Ghi chú tư vấn của dược sĩ.

### 2.5 Collection: PrescriptionVault (Kho đơn thuốc cá nhân)

Phục vụ tính năng "Mua lại đơn cũ" tại Storefront.

**Fields:** `prescriptionCode`, `issuedDate`, `expiryDate`, `doctorName`, `hospital`, `diagnosis`, `medicines` (Danh sách thuốc chi tiết), `thumbnailUrl`.

### 2.6 Collection: AssociationRules (Gợi ý mua kèm)

Chứa kết quả từ thuật toán Data Mining (Apriori/FP-Growth).

**Fields:** `antecedentId` (SP nguồn), `consequent` (SP gợi ý), `confidence` (Độ tin cậy), `lift` (Độ phổ biến).

## 🛠️ 3. Quy chuẩn Seed Data cho AI

Khi chạy `npm run seed`, AI Agent phải tuân thủ các quy tắc sau để tạo dữ liệu "thật":

**Tính Logic của Thuốc:**
- Sản phẩm `rx` (như Amoxicillin) phải có hoạt chất kháng sinh và chỉ định rõ ràng.
- Các sản phẩm `device` (như Máy đo huyết áp) không được có thuộc tính `is_prescription`.

**Logic tồn kho:** AI khi seed phải đảm bảo con số ở các chi nhánh cộng lại phải khớp với stock_quantity.

**Cảnh báo tồn kho:** Seed ít nhất 2 sản phẩm có một trong các chi nhánh có số lượng dưới 10 để test tính năng hiển thị chữ đỏ (như ảnh demo của bạn).

**Dữ liệu Đơn hàng:**
- Phải có ít nhất 5 đơn hàng ở trạng thái `COMPLETED` để làm dữ liệu đầu vào cho `AssociationRules`.
- Phải có ít nhất 2 đơn `DRAFT_RX` kèm ảnh đơn thuốc ảo để dược sĩ test tính năng duyệt toa.

**PharmaPoints:**
- Khách hàng mẫu phải có số điểm thưởng ngẫu nhiên từ 10 - 100 points để test tính năng trừ tiền đơn hàng.

## 🛡️ 4. Quan hệ Dữ liệu (Relationships)

- **One-to-Many:** `Category` ↔ `Products`.
- **One-to-Many:** `User` ↔ `Orders`.
- **Many-to-Many (Virtual):** `Products` thông qua `AssociationRules`.
