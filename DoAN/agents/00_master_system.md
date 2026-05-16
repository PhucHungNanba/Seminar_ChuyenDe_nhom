# 00_master_system.md (Hiến pháp Kỹ thuật v2.0)

## 🎯 1. Chiến lược "Vibe Coding"

**Nguyên tắc:** AI ưu tiên viết code chạy được ngay (Functional code), giao diện đẹp (Aesthetic UI) và hạn chế các thư viện bên thứ 3 quá phức tạp.

- **Ngôn ngữ:** Comment trong code sử dụng Tiếng Việt để dễ bảo trì. Tên biến/hàm sử dụng Tiếng Anh.
- **Tính nhất quán:** Mọi Agent khi sinh code mới phải kiểm tra các file đã tồn tại để đảm bảo không viết lại logic đã có.

## 🛠️ 2. Tech Stack Chi tiết

**Frontend (Storefront & Admin):**
- **Framework:** React.js (Vite).
- **Styling:** Tailwind CSS (Config màu sắc theo hệ nhận diện Long Châu).
- **State:** Zustand (để quản lý Giỏ hàng và Auth nhanh gọn).
- **Icons:** lucide-react.

**Backend (API Central):**
- **Runtime:** Node.js (Express.js).
- **Database:** MongoDB với Mongoose (Schema-based).
- **Auth:** JWT (JSON Web Token).

**Automation:**
- **n8n** (Xử lý các tác vụ ngầm như gửi mail, báo cáo hoặc tích hợp AI Consultant).

## 📂 3. Bản đồ Thư mục (Project Map)

> **AI Agent phải tuân thủ đúng cấu trúc này khi tạo file mới:**

```
/DOAN
├── /backend            # Node.js Express API
│   ├── /models         # Mongoose Schemas
│   ├── /routes         # API Endpoints
│   ├── /controllers    # Logic xử lý
│   └── /middleware     # Auth & Error handling
├── /frontend           # React Vite (Khách hàng)
│   ├── /src/components # UI Reusable
│   ├── /src/pages      # Các trang (Home, Cart, Rx)
│   └── /src/store      # Zustand stores
├── /admin              # React Vite (Quản trị)
└── /agents             # Chứa các file .md hướng dẫn này
```

## 🎨 4. Quy chuẩn Giao diện (Vibe Long Châu)

**Bảng màu:**
- **Primary:** `#003580` (Navy Blue - Tin cậy).
- **Secondary:** `#FFFFFF` (Trắng - Sạch sẽ).
- **Accent:** `#FFD700` (Vàng - Cảnh báo/Khuyến mãi).

**Typography:** Ưu tiên các font không chân (Sans-serif) như `'Inter'` hoặc `'Roboto'`.

**UI Component:** Bo góc nhẹ (`rounded-lg`), đổ bóng mờ (`shadow-sm`), tạo cảm giác hiện đại và y tế.

## 📡 5. Quy chuẩn Giao tiếp API

**Định dạng phản hồi:** Tất cả API phải trả về JSON theo cấu trúc:
- **Thành công:** `{ "success": true, "data": { ... } }`
- **Thất bại:** `{ "success": false, "message": "Lỗi cụ thể..." }`

**Error Handling:** Sử dụng mã lỗi chuẩn (400, 401, 403, 404, 500).

## 🛡️ 6. Quy tắc đặt tên (Naming Conventions)

- **Folder/Files:** `snake_case` (ví dụ: `product_controller.js`, `order_details.jsx`).
- **Biến/Hàm:** `camelCase` (ví dụ: `handleAddToCart`).
- **Component:** `PascalCase` (ví dụ: `PrescriptionCard.jsx`).
- **Database:** Tên Collection số nhiều (ví dụ: `users`, `products`).
