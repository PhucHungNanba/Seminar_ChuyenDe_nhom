# skills.md (Định nghĩa Công nghệ)

Tài liệu này quy định danh sách các công nghệ bắt buộc sử dụng cho toàn dự án **PharmaCare**. Toàn bộ các AI Agent và thành viên dự án phải tuân thủ nghiêm ngặt khung công nghệ này, không được tự ý cài đặt thêm hoặc thay đổi.

---

## 1. 🎨 Tầng Frontend & Admin Portal (Storefront & Admin)
- **Core Library:** `React.js` (TypeScript - Strict Mode)
- **Build Tool:** `Vite` (để tối ưu hóa thời gian build và hot-reload)
- **Styling (CSS):** `Tailwind CSS v4` (tận dụng engine biên dịch mới cực nhanh và gọn nhẹ)
- **State Management:** `Zustand` (quản lý state toàn cục nhẹ nhàng, dễ bảo trì, thay thế Redux cồng kềnh)
- **Icons Library:** `Lucide-React` (bộ icon tối giản, hiện đại và nhất quán)
- **Animations:** `Framer Motion` (để tạo các hiệu ứng micro-animations mượt mà, cao cấp)

## 2. 🔌 Tầng Backend API (Kiến trúc Microservices)
Dự án được xây dựng dựa trên kiến trúc phân rã dịch vụ (Microservices) độc lập:
- **Runtime Environment:** `Node.js` (TypeScript) cho 4 microservices chính và `Python` (FastAPI) cho dịch vụ AI:
  - **`api-gateway`**: Gateway định tuyến trung tâm viết bằng Express.js.
  - **`user-service`**: Quản lý tài khoản, phân quyền RBAC và tích lũy điểm thưởng viết bằng Express + Mongoose.
  - **`product-service`**: Quản lý danh mục, thông tin thuốc và kho hàng viết bằng Express + Mongoose.
  - **`order-service`**: Quản lý giỏ hàng, hóa đơn và đơn thuốc y khoa viết bằng Express + Mongoose.
  - **`ai-service`**: Dịch vụ khai phá dữ liệu luật kết hợp y tế viết bằng Python FastAPI + Uvicorn.
- **Database Driver/ODM:** `Mongoose` (MongoDB driver) cho các Node-based services.
- **Image Uploader:** `Multer` (xử lý dữ liệu form-data chứa tệp ảnh toa thuốc).
- **Media Hosting CDN:** `Cloudinary` (SDK chính thức để lưu trữ và phân phối hình ảnh toa thuốc, sản phẩm).
- **Authentication:** `JSON Web Token (JWT)` (để xác thực không lưu trạng thái - Stateless Session).

## 3. 🐳 Tầng DevOps & Triển khai (Infrastructure)
- **Containerization:** `Docker` (ảo hóa môi trường phát triển độc lập cho từng service).
- **Orchestrator:** `Docker Compose` (điều phối đồng bộ cả 5 service backend cùng 2 frontend storefront & admin).

---

## 🚫 LƯU Ý BẮT BUỘC (Strict Constraints)
- **Tuyệt đối cấm tự ý cài đặt thêm thư viện lớn bên thứ 3** như: `Redux Toolkit`, `Material UI (MUI)`, `Chakra UI`, `Sequelize`, `Prisma`, `Bootstrap`... trừ khi có chỉ thị trực tiếp từ người dùng.
- Mọi quyết định thêm thư viện mới phải được mô tả lý do kỹ thuật chi tiết trong file `04_Vibe_Coding_Rules.md` hoặc được người dùng phê duyệt bằng văn bản trước khi thực hiện.
