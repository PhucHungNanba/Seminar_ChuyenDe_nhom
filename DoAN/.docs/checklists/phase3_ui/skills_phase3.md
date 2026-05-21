# skills_phase3.md (Định nghĩa Công nghệ UI/UX)

Tài liệu này thiết lập bộ công cụ bắt buộc sử dụng trong suốt **Phase 3: Dựng Layout UI & Routing tĩnh** cho cả hai ứng dụng Storefront và Admin Portal.

---

## 1. 🚦 Tầng Định tuyến (Routing System)
- **Library:** `react-router-dom` v6.
- **YÊU CẦU CẤU HÌNH BẮT BUỘC:**
  - Sử dụng phương pháp khởi tạo định tuyến hiện đại bằng **`createBrowserRouter`** và render thông qua component **`<RouterProvider router={router} />`** tại tệp chạy chính `src/main.tsx`.
  - Tuyệt đối cấm sử dụng thẻ bọc kiểu cũ `<BrowserRouter>` hay `<HashRouter>`.

## 🎨 2. Tầng Thiết kế & Màu sắc (Styling Specifications)
- **Framework:** `Tailwind CSS v4`.
- **BẢNG MÀU THƯƠNG HIỆU NHÀ THUỐC LONG CHÂU (BẮT BUỘC):**
  - **Primary Color (Xanh Navy chủ đạo):** `#003580` (Dùng cho Header, Footer, Sidebars, các nút hành động chính).
  - **Accent Color (Vàng nổi bật):** `#FFD700` (Dùng cho Badges số lượng giỏ hàng, thông tin cảnh báo quan trọng, hoặc highlight menu đang active).
  - **Background Color (Xám Slate dịu nhẹ):** Xám nhạt `#F8FAFC` (Slate-50) để tạo cảm giác y tế sạch sẽ, dịu mắt.
- **Typography:** Sử dụng Font chữ không chân hiện đại (như Inter, Roboto, hoặc Outfit) làm mặc định cho toàn dự án.

## 📦 3. Thiết kế linh kiện dùng chung (DRY Components)
- Mọi thành phần UI được phát triển đơn lẻ và tái sử dụng tối đa, đặt trong thư mục `src/components/common/`:
  - `Button.tsx`: Nút bấm có hiệu ứng hover mượt mà.
  - `Input.tsx`: Ô nhập liệu có validation visual.
  - `Badge.tsx`: Nhãn trạng thái (Ví dụ: `Chờ duyệt`, `Hoàn thành`).
- Icon: Sử dụng duy nhất thư viện **`lucide-react`** để tạo sự nhất quán, cấm sử dụng các bộ icon khác.
