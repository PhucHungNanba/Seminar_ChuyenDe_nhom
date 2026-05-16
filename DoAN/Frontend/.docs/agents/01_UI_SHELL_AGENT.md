# 🤖 PHASE 1: UI SHELL & COMPONENTS GENERATION

**CONTEXT:** Xây dựng các UI Components tĩnh (Dumb components) cho Medicine Shop, tone màu `blue-600` (xanh y tế).

**TASKS CHO AI:**
Hãy tạo cấu trúc thư mục `src/components/` và sinh code cho các file sau:

- [ ] 1. `common/TypeBadge.tsx`: Thẻ hiển thị loại thuốc (Kê đơn/Không kê đơn), nhận prop `type` và `label`.
- [ ] 2. `cart/CartItem.tsx`: Hiển thị ảnh, tên thuốc, giá, nút (+/-), và nút xóa.
- [ ] 3. `chat/PharmacistLiveChat.tsx`: Giao diện khung chat tĩnh với AI, gồm khu vực hiện tin nhắn và ô input nhập text ở đáy.
- [ ] 4. `cart/PrescriptionUploader.tsx`: Giao diện khu vực kéo thả ảnh đơn thuốc (Dropzone UI tĩnh).

**RÀNG BUỘC (CONSTRAINTS):**
- Sử dụng thư viện `lucide-react` cho các icon.
- Code đảm bảo Responsive trên Mobile.
- Tuyệt đối chưa gọi API hay State Management ở bước này. Chỉ dùng mock data cứng (hardcoded data) truyền qua props.
