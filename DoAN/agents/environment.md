# environment.md (Kiến trúc Sư Cấu hình Hệ thống)

## 🎯 1. Nhiệm vụ & Vai trò

Định nghĩa và hướng dẫn AI Agent khởi tạo các tệp biến môi trường (`.env`) cho toàn bộ hệ sinh thái Microservices. Đảm bảo các dịch vụ có thể "nói chuyện" với nhau và kết nối thành công tới các dịch vụ Cloud bên thứ ba (MongoDB Atlas, Cloudinary, Gemini).

- **Ngữ cảnh:** Phải nạp `03_backend_agent.md` (Microservices ports) và `05_devops_agent.md` (Docker config).
- **An toàn:** Tất cả các giá trị nhạy cảm phải được để ở dạng Placeholder (VD: `your_db_link_here`) để người dùng tự điền.

## 📂 2. Cấu trúc phân bổ File .env

Dựa trên cấu trúc dự án hiện tại, AI Agent cần tạo 4 file `.env` riêng biệt trong thư mục gốc của từng dịch vụ:

### 2.1 Cho Auth Service (Port 5001)

**Vị trí:** `/backend/auth-service/.env`

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pharma_auth
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 2.2 Cho Product Service (Port 5002)

**Vị trí:** `/backend/product-service/.env`

```env
PORT=5002
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pharma_products
NODE_ENV=development
```

### 2.3 Cho Order Service (Port 5003)

**Vị trí:** `/backend/order-service/.env`

```env
PORT=5003
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pharma_orders
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Link Cloudinary dùng cho việc upload toa thuốc Rx
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
NODE_ENV=development
```

### 2.4 Cho AI Service (Port 5004)

**Vị trí:** `/backend/ai-service/.env`

```env
PORT=5004
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pharma_analytics
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

## 🌐 3. Cấu hình Frontend & Admin (Client-side)

Các ứng dụng React (Vite) cần biết địa chỉ của API Gateway hoặc các Service tương ứng.

### 3.1 Cho Storefront (Frontend)

**Vị trí:** `/Frontend/.env`

```env
VITE_API_AUTH_URL=http://localhost:5001/api/auth
VITE_API_PRODUCT_URL=http://localhost:5002/api/products
VITE_API_ORDER_URL=http://localhost:5003/api/orders
VITE_API_AI_URL=http://localhost:5004/api/ai
```

### 3.2 Cho Admin Portal

**Vị trí:** `/Admin/.env`

```env
VITE_API_ADMIN_URL=http://localhost:5002/api/admin  # Quản lý kho
VITE_API_RX_APPROVAL_URL=http://localhost:5003/api/orders/rx # Duyệt toa
VITE_API_ANALYTICS_URL=http://localhost:5004/api/analytics # Báo cáo AI
```

## 🛠️ 4. Quy tắc khởi tạo dữ liệu cho AI

Khi AI Agent thực hiện lệnh tạo file, phải tuân thủ:

**Khớp Port:** Port phải khớp 100% với định nghĩa trong `03_backend_agent.md`.

**MongoDB Atlas:** Luôn sử dụng định dạng kết nối `mongodb+srv://` để hỗ trợ Atlas Cluster.

**Cloudinary:** Đảm bảo các biến Cloudinary được tập trung tại Order Service vì đây là nơi xử lý ảnh toa thuốc Rx.

**Gemini:** API Key chỉ đặt tại AI Service để bảo mật.
