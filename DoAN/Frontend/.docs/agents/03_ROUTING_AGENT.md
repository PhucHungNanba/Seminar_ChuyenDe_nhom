# 🤖 PHASE 3: PAGES & ROUTING ASSEMBLY

**CONTEXT:** Thiết lập điều hướng sử dụng `react-router-dom` v6 và tạo các trang chính tại thư mục `src/pages/`.

**TASKS CHO AI:**
Hãy sinh code cho các file sau:

- [ ] 1. Thiết lập `App.tsx`: Cấu hình BrowserRouter.
- [ ] 2. Trang `Home/index.tsx`: Tích hợp Navbar, Hero Banner (sinh tự do) và component `PharmacistLiveChat`.
- [ ] 3. Trang `Cart/index.tsx`: Map dữ liệu từ `cartStore` xuống các component `CartItem`. Tính tổng tiền.
- [ ] 4. Trang `Checkout/index.tsx`: Bọc bằng chức năng Private Route (nếu không có token thì đẩy về trang Login). Render form nhập địa chỉ giao hàng.

**RÀNG BUỘC (CONSTRAINTS):**
- Lấy state trực tiếp từ các file trong `src/store/` đã tạo ở Phase 2.
- Layout sử dụng CSS Grid hoặc Flexbox để đảm bảo tính hiện đại.
