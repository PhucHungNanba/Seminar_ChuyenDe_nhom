# 🤖 PHASE 2: STATE MANAGEMENT IMPLEMENTATION

**CONTEXT:** Xây dựng kho lưu trữ trạng thái toàn cục (Global State) bằng thư viện [Zustand / Redux Toolkit - Tùy bạn chọn]. Nằm tại `src/store/`.

**TASKS CHO AI:**
Hãy sinh code cho các file logic sau:

- [ ] 1. `cartStore.ts`: 
    - Khai báo Interface `CartItem`.
    - Viết logic state: mảng `items`, `totalItems`, `totalPrice`.
    - Viết actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`.
- [ ] 2. `rxStore.ts` (Xử lý đơn thuốc OCR):
    - Viết logic state: mảng `extractedMedicines`, chuỗi `prescriptionImageBase64`, boolean `isAnalyzing`.
    - Viết actions: `setPrescriptionImage`, `setAnalyzingStatus`, `setExtractedResults`.

**RÀNG BUỘC (CONSTRAINTS):**
- Đảm bảo logic tính `totalPrice` trong `cartStore` tự động chạy lại mỗi khi mảng `items` thay đổi (Derived state).
- Viết code TypeScript nghiêm ngặt (Strict mode).
