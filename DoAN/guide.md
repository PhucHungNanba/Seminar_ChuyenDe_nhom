# Hướng Dẫn Chạy Dự Án Smart Medicine Shop

Dự án này được thiết kế theo kiến trúc Microservices kết hợp với Vite React cho Client. Để hệ thống hoạt động đầy đủ, bạn cần chạy đồng thời các service ở Backend thông qua API Gateway, sau đó khởi chạy Frontend và Admin.

## Yêu cầu hệ thống
- **Node.js** (nếu chạy thủ công)
- **Docker & Docker Compose** (nếu chạy bằng Docker)
- Đảm bảo các file `.env` đã được cấu hình đầy đủ ở thư mục `Frontend`, `Admin` và các service trong `Backend` (như đã setup trước đó).

---

## 🐳 CÁCH 1: KHỞI CHẠY BẰNG DOCKER (KHUYÊN DÙNG)

Đây là cách nhanh chóng và tiện lợi nhất để khởi chạy toàn bộ các component (Frontend, Admin, API Gateway, User Service, Product Service, Order Service) cùng một lúc.

**Bước 1:** Mở Terminal tại thư mục gốc của dự án (nơi chứa file `docker-compose.yml`).

**Bước 2:** Chạy lệnh sau để build và chạy tất cả:
```bash
docker-compose up -d --build
```
> **Lưu ý:** Lần đầu chạy sẽ mất vài phút để tải image và cài đặt. Cờ `-d` giúp chạy nền.
> (Ghi chú: `ai-service` được thiết lập `profile: dont-start` nên sẽ mặc định không chạy).

**Bước 3:** Khi quá trình hoàn tất, bạn có thể truy cập ngay:
- **Frontend:** http://localhost:5173
- **Admin:** http://localhost:5174

Để dừng hệ thống, bạn gõ lệnh:
```bash
docker-compose down
```

---

## 💻 CÁCH 2: KHỞI CHẠY THỦ CÔNG (TỪNG SERVICE)

Nếu bạn muốn chạy thủ công để code hoặc không sử dụng Docker, hãy làm theo các bước dưới đây.

### Bước 1: Khởi chạy Backend (Microservices)

Backend bao gồm nhiều service hoạt động độc lập và giao tiếp với Client qua `api-gateway`. Bạn cần mở nhiều Terminal (hoặc sử dụng tính năng split terminal trong VSCode) để chạy song song.

Đầu tiên, cài đặt thư viện cho tất cả các service (chỉ cần chạy 1 lần lúc đầu):
```bash
# Ở thư mục gốc của dự án, mở Terminal và cài đặt cho từng thư mục:
cd Backend/api-gateway && npm install
cd ../user-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
```

Tiếp theo, hãy chạy từng service trong các Terminal riêng biệt:

**1. API Gateway (Bắt buộc chạy đầu tiên - "Bảo vệ cổng")**
```bash
cd Backend/api-gateway
npm run dev    # (Hoặc npm start tùy vào file package.json)
```

**2. User Service**
```bash
cd Backend/user-service
npm run dev
```

**3. Product Service**
```bash
cd Backend/product-service
npm run dev
```

**4. Order Service**
```bash
cd Backend/order-service
npm run dev
```

*(Nếu Backend của bạn có script gộp tự động để chạy tất cả cùng lúc, bạn có thể kiểm tra file `setup_microservices.ps1` có sẵn trong thư mục Backend).*

---

## 🚀 Bước 2: Khởi chạy Client (Frontend & Admin)

**1. Khởi chạy Website Frontend (Khách hàng)**
Mở một Terminal mới từ thư mục gốc dự án:
```bash
cd Frontend
npm install    # (Chỉ cần 1 lần)
npm run dev
```
👉 *Giao diện sẽ chạy tại:* **http://localhost:5173**

**2. Khởi chạy Website Admin (Quản trị viên)**
Mở một Terminal khác:
```bash
cd Admin
npm install    # (Chỉ cần 1 lần)
npm run dev
```
👉 *Giao diện sẽ chạy tại:* **http://localhost:5174**

---

## 📌 Sơ Đồ Các Cổng (Ports) Đang Hoạt Động

- 🌐 **Frontend (Khách):** `:5173`
- 🌐 **Admin (Quản lý):** `:5174`
- 🛡️ **API Gateway:** `:3000` *(Mọi request từ Client đều gọi vào đây qua `http://localhost:3000/api/...`)*
- ⚙️ **User Service:** `:3001` *(Ẩn sau Gateway)*
- ⚙️ **Product Service:** `:3002` *(Ẩn sau Gateway)*
- ⚙️ **Order Service:** `:3003` *(Ẩn sau Gateway)*
- 🤖 **AI Service:** `:8000` *(Ẩn sau Gateway - dành cho tính năng gợi ý thuốc nếu có)*

---

🎉 **Chúc bạn khởi chạy dự án thành công!** 🚀
