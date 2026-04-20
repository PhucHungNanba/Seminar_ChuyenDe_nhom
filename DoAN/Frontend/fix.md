# PharmaCare Frontend — Fix & Improvement Log

> Tài liệu này ghi lại tất cả lỗi, điểm trống, và cải tiến cần làm cho Frontend.
> Cập nhật lần cuối: 2026-04-19

---

## 🔴 Lỗi thực sự (Breaking / Incorrect behavior)

### [BUG-01] Navbar "Tài khoản" link trỏ sai route
**File:** `src/components/layout/Navbar.tsx` — dòng 157
```tsx
// Hiện tại — SAI: /auth chưa tồn tại, không có route
<Link to="/auth" id="btn-user">Tài khoản</Link>

// Cần sửa thành
<Link to="/profile" id="btn-user">Tài khoản</Link>
```
**Ảnh hưởng:** Click "Tài khoản" → 404 blank. Mobile menu cũng trỏ `/auth`.

---

### [BUG-02] Navbar mobile menu "Theo dõi đơn hàng" link trỏ `/orders` — route chưa tồn tại
**File:** `src/components/layout/Navbar.tsx` — dòng 212, 242
```tsx
{ label: 'Theo dõi đơn hàng', to: '/orders' }  // /orders không có route
```
**Ảnh hưởng:** Click → blank page. Cần đổi thành `/orders/ORD-001` tạm thời, hoặc tạo `OrdersListPage`.

---

### [BUG-03] `ProductsPage` không đọc query param từ URL
**File:** `src/pages/Products/ProductsPage.tsx`

Navbar search submit → `navigate('/products?q=paracetamol')` (Navbar dòng 47).
Navbar category links → `/products?type=otc`, `/products?cat=vitamin`.

Nhưng `ProductsPage` **không đọc `useSearchParams()`** — query param bị bỏ qua hoàn toàn.

```tsx
// Cần thêm vào ProductsPage
import { useSearchParams } from 'react-router-dom'

const [searchParams] = useSearchParams()

useEffect(() => {
  const q = searchParams.get('q')
  const type = searchParams.get('type')  // 'otc' | 'rx'
  if (q) setQuery(q)
  if (type === 'otc') setFilters(f => ({ ...f, types: new Set(['otc']) }))
  if (type === 'rx')  setFilters(f => ({ ...f, types: new Set(['rx']) }))
}, [searchParams])
```
**Ảnh hưởng:** Navbar search không hoạt động. Category nav links vô nghĩa.

---

### [BUG-04] `OrderTrackingPage` back button trỏ `/orders` — route chưa tồn tại
**File:** `src/pages/OrderTracking/OrderTrackingPage.tsx` — dòng 114, 344
```tsx
<Link to="/orders">  // route này không có
```
**Ảnh hưởng:** Click "← back" → blank page. "Lịch sử đơn hàng" button cũng bị.

---

### [BUG-05] `UserProfilePage` "Đăng xuất" không có logic — chỉ navigate về `/`
**File:** `src/pages/Profile/UserProfilePage.tsx`

Hiện tại chỉ `navigate('/')` — không clear state, không clear auth token.
Khi có Auth thật: phải clear Zustand store + localStorage token.

---

### [BUG-06] `PrescriptionVault` — badge "Còn N ngày" tính ra số âm khi expired
**File:** `src/pages/Profile/UserProfilePage.tsx` — `PrescriptionCard`
```tsx
const daysLeft = Math.ceil((new Date(prx.expiryDate).getTime() - Date.now()) / 86400000)
const isExpiringSoon = prx.status === 'valid' && daysLeft <= 30
// Nếu status='expired', daysLeft âm nhưng badge vẫn render "Còn -428 ngày"
```
**Ảnh hưởng:** Card expired hiển thị badge "Còn -428 ngày" — xấu về UX.
```tsx
// Fix: chỉ render badge khi daysLeft > 0
const isExpiringSoon = prx.status === 'valid' && daysLeft > 0 && daysLeft <= 30
// Xóa badge hoàn toàn nếu expired
```

---

## 🟡 Tính năng trống / Chưa implement

### [EMPTY-01] Route `/orders` — Danh sách đơn hàng chưa có
**Hiện trạng:** Navbar, OrderTrackingPage đều link đến `/orders` nhưng route không tồn tại.
**Cần tạo:** `src/pages/Orders/OrdersListPage.tsx`
- Hiển thị danh sách đơn hàng dạng card (mock data từ MOCK_ORDERS)
- Mỗi card: mã đơn, ngày đặt, trạng thái badge, tổng tiền, nút "Theo dõi"
- Link đến `/orders/:id`

---

### [EMPTY-02] Route `/auth` — Login/Register chưa có
**Hiện trạng:** Navbar "Tài khoản" link `/auth` → 404.
**Cần tạo:** `src/pages/Auth/AuthPage.tsx`
- Tab Login / Register
- Form email + password với validation
- Sau login: set mock user state, redirect `/profile`

---

### [EMPTY-03] `UserProfilePage` — 4 nav items còn lại là `ComingSoon`
- **Lịch sử đơn hàng**: cần render danh sách từ `MOCK_ORDERS`
- **Thông tin cá nhân**: form edit tên, email, SĐT, địa chỉ
- **Thông báo**: list notification items
- **Bảo mật**: đổi mật khẩu, 2FA placeholder

---

### [EMPTY-04] `ProductsPage` — Không có pagination / infinite scroll
**Hiện trạng:** Render toàn bộ 17 sản phẩm cùng lúc.
Khi catalog lớn (100+ SP từ BE) → performance vấn đề.
**Cần thêm:** pagination đơn giản (Previous / Next) hoặc "Load more" button.

---

### [EMPTY-05] `MedicineDetailPage` — Dùng `mockMedicines.ts` (4 SP), không dùng `allProducts.ts` (17 SP)
**File:** `src/pages/MedicineDetail/MedicineDetailPage.tsx` — dòng 8
```tsx
import { getMedicineById } from '../../data/mockMedicines'  // chỉ có 4 SP
```
Các SP trong `allProducts.ts` (`otc-003` đến `med-003`) khi click từ `ProductsPage` → **404 "Không tìm thấy thuốc"**.
**Cần:** Merge hoặc dùng `allProducts.ts` làm source of truth duy nhất cho detail page.

---

### [EMPTY-06] `CheckoutPage` — Success screen không link đến order tracking
**Hiện trạng:** Sau checkout thành công, hiển thị mã đơn `#PC{timestamp}` nhưng không có nút "Theo dõi đơn hàng" → `/orders/ORD-001`.
**Cần thêm:** Button "Theo dõi đơn hàng ngay" → navigate đến `/orders/ORD-001` (mock).

---

### [EMPTY-07] `HomePage` — CategoryGrid click chỉ navigate `/products` không có filter
**Hiện trạng:**
```tsx
onClick={() => navigate('/products')}  // tất cả 3 categories đều vào /products trống
```
**Cần sửa:**
```tsx
// Thuốc kê đơn
onClick={() => navigate('/products?type=rx')}
// Thuốc không kê đơn
onClick={() => navigate('/products?type=otc')}
// Vật tư y tế
onClick={() => navigate('/products?form=device')}
```
Nhưng **chỉ có hiệu lực sau khi fix [BUG-03]**.

---

### [EMPTY-08] `FrequentlyBoughtTogether` — Skeleton loader không có real loading state
**Hiện trạng:** `isLoading` prop tồn tại nhưng không có nơi nào truyền `isLoading={true}`.
Khi kết nối BE: cần wrap với React Query và truyền `isLoading` từ `useQuery`.

---

### [EMPTY-09] `Navbar` search suggestions — dùng hardcode 5 items
**File:** `src/components/layout/Navbar.tsx` — dòng 11–17
```tsx
const SUGGESTIONS = ['Paracetamol 500mg', 'Vitamin C 1000mg', ...]
```
Cần thay bằng filter realtime từ `ALL_PRODUCTS` (17 SP) hoặc API.

---

### [EMPTY-10] Cart không persist sau reload trang
**Hiện trạng:** Zustand store không có `persist` middleware → reload trang → giỏ hàng trống.
**Cần thêm:**
```ts
import { persist } from 'zustand/middleware'
export const useCartStore = create<CartStore>()(
  persist((set, get) => ({ ... }), { name: 'pharmacare-cart' })
)
```

---

### [EMPTY-11] `MockCartSeeder` trong `App.tsx` — xung đột với persist
Nếu thêm persist vào cartStore, `MockCartSeeder` sẽ seed lại mỗi lần reload nếu không xử lý đúng.
**Cần xóa `MockCartSeeder`** khi có Auth thật, hoặc chỉ seed khi `localStorage` trống.

---

## 🔵 Cải tiến UX / UI cần làm

### [UX-01] Không có 404 page
**Hiện trạng:** Route không match → blank white page.
**Cần thêm:**
```tsx
<Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
```

---

### [UX-02] `ProductsPage` — không có loading state khi filter
Khi filter thay đổi, grid cập nhật ngay lập tức — không có transition mượt mà.
`AnimatePresence layout` đã có nhưng cần thêm delay nhỏ để tránh flash.

---

### [UX-03] `MedicineDetailPage` — thumbnail strip (3 ảnh) chỉ là placeholder lặp cùng 1 ảnh
Dòng 130–143: 3 thumbnails đều dùng `medicine.imageUrl`. Cần gallery thực hoặc bỏ bớt.

---

### [UX-04] `CartPage` — không có nút "Xóa tất cả giỏ hàng"
Chỉ có xóa từng item. Thêm nút "Xóa tất cả" ở header giỏ hàng.

---

### [UX-05] `PrescriptionVault` — không có empty state khi filter "Hợp lệ" / "Hết hạn" trả về 0
Nếu user filter "Hết hạn" mà không có đơn nào hết hạn → grid trống, không có message.

---

### [UX-06] `MainLayout` — `<main>` có `max-w-7xl mx-auto px-4` nhưng `HeroBanner` cần full-width
`HeroBanner` bị constrain bởi padding của `<main>`. Cần breakout hoặc dùng `-mx-4 sm:-mx-6 lg:-mx-8`.

---

### [UX-07] Không có scroll-to-top khi navigate giữa các trang
React Router không tự scroll về đầu trang khi chuyển route.
**Cần thêm** `ScrollRestoration` component từ React Router v7.

---

## 🟢 Cải tiến kỹ thuật / Code quality

### [TECH-01] `mockMedicines.ts` và `allProducts.ts` bị duplicate data
4 sản phẩm trong `mockMedicines.ts` (dùng cho `MedicineDetailPage`) trùng với `allProducts.ts`.
**Cần:** Dùng `allProducts.ts` + bổ sung trường `tabs: TabContent` vào interface `Product`.
Xóa `mockMedicines.ts`, cập nhật `getMedicineById` import.

---

### [TECH-02] `featuredStore.ts` duplicate data với `allProducts.ts`
8 sản phẩm trong `featuredStore.ts` là subset của `allProducts.ts` nhưng type khác nhau (`FeaturedProduct` vs `Product`).
**Cần:** Refactor để `featuredStore` chỉ lưu IDs, lấy data từ `ALL_PRODUCTS`.

---

### [TECH-03] Không có TypeScript strict checks cho form validation
`CheckoutPage` validation SĐT dùng regex inline — không có Zod/Yup schema.
Dễ bỏ sót edge cases khi scale.

---

### [TECH-04] `AssociationRule` mock data key bằng `antecedentId` nhưng không có index
`getRulesForProducts()` loop O(n×m) qua toàn bộ 14 rules.
Khi có 1000+ rules từ BE → chậm. Cần index theo `antecedentId`.

---

## 📋 Priority Order (Đề xuất làm theo thứ tự)

| # | Fix | Mức độ | Effort |
|---|---|---|---|
| 1 | [BUG-01] Navbar link `/auth` → `/profile` | 🔴 Critical | 5 phút |
| 2 | [BUG-03] ProductsPage đọc query params | 🔴 Critical | 30 phút |
| 3 | [BUG-06] Badge "Còn -N ngày" khi expired | 🔴 Bug | 5 phút |
| 4 | [BUG-02/04] Fix `/orders` links tạm thời | 🔴 Critical | 5 phút |
| 5 | [EMPTY-05] MedicineDetailPage dùng allProducts | 🟡 High | 1 giờ |
| 6 | [EMPTY-01] OrdersListPage | 🟡 High | 2 giờ |
| 7 | [EMPTY-07] CategoryGrid navigate với filter | 🟡 High | 10 phút |
| 8 | [EMPTY-10] Cart persist middleware | 🟡 Medium | 30 phút |
| 9 | [UX-01] 404 NotFoundPage | 🟡 Medium | 30 phút |
| 10 | [UX-07] ScrollRestoration | 🟢 Low | 10 phút |
| 11 | [EMPTY-02] AuthPage | 🟢 Low | 3 giờ |
| 12 | [TECH-01] Merge mockMedicines → allProducts | 🟢 Refactor | 1 giờ |
| 13 | [EMPTY-04] Pagination ProductsPage | 🟢 Low | 1 giờ |
| 14 | [EMPTY-09] Navbar suggestions từ allProducts | 🟢 Low | 20 phút |
