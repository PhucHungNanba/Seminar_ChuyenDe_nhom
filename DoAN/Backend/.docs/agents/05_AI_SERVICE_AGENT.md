# 🤖 PHASE 4: AI SERVICE (FASTAPI) IMPLEMENTATION

**CONTEXT:** Hoàn thiện service tích hợp Trí tuệ nhân tạo. Thư mục làm việc: `ai-service`. Ngôn ngữ: Python 3.

**TASKS CHO AI:**
Hãy sinh code vào đúng các file đã khởi tạo:

- [ ] 1. `services/gemini_service.py`: 
    - Khởi tạo thư viện `google-generativeai`.
    - Viết hàm `analyze_prescription_image(image_base64)`: Gửi ảnh cho Gemini, yêu cầu bóc tách tên thuốc, trả về định dạng JSON nghiêm ngặt.
- [ ] 2. `services/product_client.py`: 
    - Dùng thư viện `httpx` (hoặc `requests`) viết hàm gọi HTTP GET sang `http://localhost:3002/api/v1/products/search` (Product Service) để check xem thuốc Gemini đọc được có trong kho không.
- [ ] 3. `routers/analyze.py`: 
    - Tạo endpoint `POST /analyze`.
    - Nhận file upload từ người dùng -> gọi `gemini_service` -> lấy kết quả gọi tiếp `product_client` -> trả về JSON cuối cùng cho Frontend.
- [ ] 4. `main.py`: Setup FastAPI, include router từ `analyze.py`, cấu hình CORS cho phép API Gateway gọi tới.

**RÀNG BUỘC:**
- Code phải có type hinting chuẩn của Python (`def hàm(ảnh: str) -> dict:`).
- Tạo file `requirements.txt` bổ sung các thư viện cần thiết.
