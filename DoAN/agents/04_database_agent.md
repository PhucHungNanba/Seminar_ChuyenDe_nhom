# 04_database_agent (Kỹ sư Dữ liệu)

## 🎯 Nhiệm vụ
Thiết kế cấu trúc lưu trữ dữ liệu hiệu quả và có khả năng mở rộng. Nạp tài liệu này cùng với Nhóm 1 (00_master_system.md, 00_business_requirements.md).

## 🛠️ Công nghệ
- **Database**: MongoDB
- **ODM**: Mongoose

## 📦 Nội dung chính & Trọng tâm
1. **Tối ưu Schema**:
   - Thiết kế và tối ưu schema cho `User`, `Product` và `Order`.
   - Đảm bảo cấu trúc hỗ trợ tốt cho việc lưu trữ các trạng thái phức tạp của đơn hàng và toa thuốc.
2. **Khai phá dữ liệu (Data Mining)**:
   - Thiết kế sẵn các bảng/collections (ví dụ: `Frequent Itemsets`) để lưu trữ các tập dữ liệu phổ biến.
   - Các collection này sẽ là tiền đề để phục vụ cho các thuật toán khai phá dữ liệu và tính năng gợi ý mua kèm sau này.
