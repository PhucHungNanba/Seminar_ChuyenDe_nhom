# 00_master_system (Hiến pháp Kỹ thuật)

## 🎯 Nhiệm vụ
Định nghĩa "luật chơi" về công nghệ cho toàn dự án. Bất kể Agent nào thực thi (Frontend hay Backend), luôn phải nạp tài liệu này vào ngữ cảnh đầu tiên.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Zustand.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Deployment & Automation**: Docker, docker-compose, n8n.

## 🎨 Phong cách Code (Vibe Long Châu)
- Giao diện phải chuyên nghiệp, đáng tin cậy, lấy cảm hứng từ nhà thuốc Long Châu (màu sắc chủ đạo: Xanh navy/Trắng/Xám, typography rõ ràng).
- Code sạch, chia component nhỏ gọn, có khả năng tái sử dụng cao.
- UX/UI tập trung vào sự mượt mà và thân thiện với người dùng.

## 📂 Quy chuẩn & Cấu trúc
- **Tên file/thư mục**: Nhất quán, dễ đọc.
- **Cấu trúc thư mục**: Phân tách rõ ràng giữa `Frontend` (Storefront), `Admin` (Back-office) và `Backend` (API).

## 🚧 Giới hạn Dự án (MVP)
- **Ưu tiên**: Tập trung vào UI/UX cốt lõi cho luồng mua hàng và xử lý đơn thuốc.
- **Mô phỏng**: Các tính năng thanh toán thực tế và ràng buộc pháp lý phức tạp sẽ được mô phỏng hoặc làm mộc (mocked) trong phiên bản MVP này để đảm bảo tiến độ dự án.
