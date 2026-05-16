# 06_ai_consultant.md (Kiến trúc sư Trợ lý Ảo v2.0 - Tầm nhìn Tương lai)

## 🎯 1. Nhiệm vụ & Tầm nhìn

Thiết lập và vận hành AI Service (chạy tại cổng 5004) để cung cấp trải nghiệm hỗ trợ cá nhân hóa cho khách hàng và phân tích dữ liệu chuyên sâu cho quản trị viên. AI không thay thế con người mà đóng vai trò là một "Dược sĩ số" hỗ trợ tra cứu và tư vấn sơ bộ.

- **Ngữ cảnh bắt buộc:** Phải đọc `00_business_requirements.md` (Quy tắc nghiệp vụ) và `03_backend_agent.md` (Cấu trúc Microservices).
- **Công cụ:** Gemini AI API, LangChain (hoặc tương đương), `ai-service` (Port 5004).

## 🛡️ 2. Hệ thống Vòng bảo vệ (Medical Guardrails) - TỐI QUAN TRỌNG

AI Agent khi xử lý truy vấn từ khách hàng phải tuyệt đối tuân thủ bộ quy tắc sau:

**Không chẩn đoán:** Tuyệt đối không trả lời các câu hỏi mang tính chẩn đoán bệnh (VD: "Tôi bị đau bụng là bệnh gì?"). Thay vào đó, hãy liệt kê các nhóm thuốc hỗ trợ triệu chứng phổ biến và yêu cầu đi khám.

**Không kê đơn thuốc Rx:** Khi người dùng hỏi về thuốc có nhãn `is_prescription: true`, AI phải trả lời: "Đây là thuốc kê đơn, bạn cần có chỉ định của bác sĩ. Hãy tải toa thuốc lên để dược sĩ của chúng tôi tư vấn cụ thể".

**Cảnh báo bắt buộc:** Mọi câu trả lời về cách dùng thuốc phải kèm theo câu: "Thông tin này chỉ mang tính tham khảo. Vui lòng đọc kỹ hướng dẫn sử dụng hoặc hỏi ý kiến dược sĩ tại cửa hàng".

## 📦 3. Tính năng AI cho Storefront (Khách hàng)

### 3.1 Trợ lý tra cứu thông minh (RAG - Retrieval-Augmented Generation)

**Logic:** AI truy cập vào Product Service để lấy thông tin từ các trường `tabs.ingredients`, `indications`, `dosage`.

**Mục tiêu:** Trả lời nhanh công dụng của thuốc, thành phần và lưu ý khi sử dụng dựa trên dữ liệu thật của cửa hàng.

### 3.2 Tra cứu trạng thái đơn hàng (NLP Search)

**Logic:** Kết nối với Order Service.

**Hành động:** Khi khách hỏi "Đơn hàng của tôi đến đâu rồi?", AI yêu cầu cung cấp SĐT/Mã đơn và trả về trạng thái thời gian thực (`DRAFT_RX`, `SHIPPING`, v.v.).

## 📈 4. Tính năng AI cho Admin (Quản trị viên)

### 4.1 Khai phá dữ liệu (Market Basket Analysis)

**Thuật toán:** Thực hiện phân tích các cặp sản phẩm thường được mua cùng nhau từ lịch sử đơn hàng (Orders Collection).

**Kết quả:** Tự động cập nhật dữ liệu vào `AssociationRules` để phục vụ tính năng gợi ý mua kèm (`FrequentlyBoughtTogether` component) trên Frontend.

### 4.2 Hỗ trợ Dược sĩ duyệt đơn (AI Vision - Tùy chọn)

**Mô tả:** Sử dụng khả năng đọc hiểu hình ảnh của Gemini để phân tích ảnh toa thuốc khách upload.

**Hành động:** Trích xuất tên thuốc từ ảnh toa và tự động gợi ý danh sách sản phẩm tương ứng trong kho cho dược sĩ tại trang RxApproval.

## 📡 5. Quy chuẩn tích hợp (AI Service Integration)

**Endpoint:**
- `POST /api/ai/chat` (Tiếp nhận tin nhắn và trả về phản hồi đã qua filter guardrails).
- `GET /api/ai/recommendations` (Trả về gợi ý mua kèm dựa trên giỏ hàng hiện tại).

**Giao tiếp:** Gọi API nội bộ sang Product Service và Order Service để lấy dữ liệu ngữ cảnh (Context) trước khi gửi prompt tới Gemini.
