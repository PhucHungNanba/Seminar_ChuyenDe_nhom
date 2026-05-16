# 3_PROJECT_RULES.md (Luật "Vibe Coding")

> **CẢNH BÁO CHO AI:** Mọi dòng code, cấu trúc bạn thiết kế đều BẮT BUỘC tuân thủ chặt chẽ 100% các luật lệ bên dưới.

## 1. Quy chuẩn Cấu trúc & Mã nguồn
- **Modular Monolith / Microservices:** Tách các module nhỏ gọn.
- **Độ dài hàm (Functions):** KHÔNG viết bất kỳ hàm nào vượt quá **50 dòng code**. Nếu quá dài, bắt buộc phải chia nhỏ thành các Hàm Helper bên ngoài.
- **Node.js (Express)**: Khuyến khích sử dụng ES6 modules (`import/export`) nếu cấu hình package.json cho phép, nếu không dùng chuẩn CommonJS gọn gàng.
- **Python (FastAPI)**: Phải có Type Hints đầy đủ cho parameters và return values.

## 2. Định dạng Trả về Lỗi Tiêu chuẩn (Standard Error Format)
Tuyệt đối không trả về string tĩnh khi lỗi. Mọi Error, Exception, Not Found hay Validation Error phải được gói trong cấu trúc JSON như sau:

```json
{
  "success": false,
  "message": "Nội dung thông báo lỗi mô tả dễ hiểu cho người dùng/dev",
  "code": 404
}
```
*(Trong đó trường `code` sẽ chứa mã HTTP Status).*

## 3. Quy chuẩn Logging
- BẮT BUỘC phải log lỗi ra console hoặc file (e.g. `console.error(err)`) trước khi gửi Error Format về cho Client. Tuyệt đối không "nuốt lỗi" bằng block catch trống (`catch(e) {}`).
- Cần có log thông báo lúc Server, DB được kết nối thành công.

## 4. Bắt buộc Áp dụng TDD (Test-Driven Development)
- Bất kì khi nào xây dựng một API Endpoint mới, AI phải chủ động sinh ra thêm kịch bản test (Sử dụng `Jest` + `Supertest` + Memory DB cho Node.js hoặc `Pytest` cho Python). Đảm bảo tuân thủ hình mẫu phát triển của V-Model.
