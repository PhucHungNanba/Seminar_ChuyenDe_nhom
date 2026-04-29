# 03_backend_agent (Kỹ sư Logic & API)

## 🎯 Nhiệm vụ
Xây dựng hệ thống máy chủ và RESTful API. Nạp tài liệu này cùng với Nhóm 1 (00_master_system.md, 00_business_requirements.md).

## 🛠️ Công nghệ & Kiến trúc
- **Môi trường & Framework**: Node.js, Express.js.
- **Architecture**: RESTful API.

## 📦 Nội dung chính & Trọng tâm
1. **RESTful API**:
   - Xây dựng hệ thống API đáp ứng cho Frontend và Admin.
2. **Luồng trạng thái đơn hàng**:
   - Xử lý logic chuyển đổi trạng thái đơn hàng chặt chẽ (Ví dụ: `Draft` -> `Pending Payment`).
   - Đảm bảo tính nhất quán dữ liệu trong quá trình dược sĩ thao tác trên hệ thống.
3. **Logic nghiệp vụ**:
   - Xây dựng logic quản lý điểm thưởng (trừ điểm khi mua hàng).
4. **Market Basket Analysis (Phân tích giỏ hàng)**:
   - Chuẩn bị sẵn các endpoint để chạy thuật toán Market Basket Analysis nhằm phục vụ cho tính năng gợi ý mua kèm (Cross-sell) trong tương lai.
