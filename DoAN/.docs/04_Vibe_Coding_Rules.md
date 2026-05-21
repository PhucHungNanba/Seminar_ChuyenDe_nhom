# 04_Vibe_Coding_Rules.md (Hiến pháp Vibe Coding & Quy chuẩn Phát triển Dự án)

## 🎭 Vai trò & Bối cảnh phát triển
- **Đóng vai:** Lead DevOps & AI Workflow Architect.
- **Mục tiêu:** Thiết lập bản **"Hiến pháp Vibe Coding"** – bộ quy tắc, chỉ thị hệ thống (System Prompts) và ranh giới hành vi bắt buộc cho mọi AI Agent (bao gồm cả các phiên làm việc tiếp theo) khi tham gia pair-programming, sinh mã nguồn hoặc bảo trì hệ thống **PharmaCare**.
- **Hiệu lực thi hành:** Đây là tài liệu tối cao kiểm soát chất lượng codebase. Bất kỳ mã nguồn nào được viết ra không tuân thủ tài liệu này đều bị coi là **hợp lệ nhưng không đạt chuẩn** và phải được refactor ngay lập tức.

---

## 1. 🚫 Lệnh cấm tuyệt đối (Red Lines)

Để đảm bảo an toàn hệ thống, tránh xung đột phiên bản và giữ vững tính toàn vẹn của kiến trúc dữ liệu, AI Agent tuyệt đối không được phép vi phạm 3 giới hạn đỏ sau:

### ⛔ Quy tắc 1.1: Không tự ý chạy Terminal (No Unapproved Command Execution)
- AI Agent **tuyệt đối không được tự động đề xuất chạy** các lệnh cài đặt, đóng gói hoặc thao tác hệ thống (như `npm`, `yarn`, `docker`, `docker-compose` hoặc các lệnh `git` phá hủy dữ liệu) trừ khi được người dùng yêu cầu rõ ràng hoặc đồng ý bằng văn bản.
- Mọi câu lệnh chạy trên môi trường hệ thống của người dùng phải được đưa ra dưới dạng đề xuất minh bạch để người dùng phê duyệt thủ công.

### ⛔ Quy tắc 1.2: Không phá vỡ kiến trúc (No Architecture Breakdown)
- **Cấm tự ý cài đặt thư viện bên thứ 3 (Dependencies):** Không được tự tiện thêm các package vào `package.json` trừ khi giải thích tường tận nguyên nhân, sự cần thiết kỹ thuật và được người dùng đồng ý duyệt trước.
- **Tôn trọng Modular Monolith:** Nghiêm cấm mọi hành vi kết nối chéo trực tiếp (cross-query) giữa các model database của các module khác nhau.

### ⛔ Quy tắc 1.3: Không "đoán" hoặc "bịa" trường dữ liệu (No Data Guessing)
- Nếu cấu trúc database được quy định tại tệp tin đặc tả [03_Architecture_&_Database.md](file:///d:/Seminar_git/Seminar_ChuyenDe_nhom/DoAN/.docs/03_Architecture_&_Database.md) không chứa trường dữ liệu (field) đó, **tuyệt đối không được tự ý bịa ra trường mới trên UI/Frontend** để hiển thị hoặc tự động lưu vào DB.
- Khi UI yêu cầu một thông tin chưa được hỗ trợ bởi Database Schema, AI Agent phải báo cáo rõ ràng và yêu cầu người dùng cập nhật, phê duyệt Schema mới trước khi tiến hành viết code cho cả Backend và Frontend.

---

## 2. 💻 Tiêu chuẩn Viết Code (Coding Standards)

Mọi dòng code được sinh ra phải đạt các chỉ số chất lượng cao nhất về khả năng đọc hiểu, bảo trì và hiệu năng.

### ⚙️ Quy tắc 2.1: Công nghệ & Môi trường bắt buộc
- **Ngôn ngữ:** Sử dụng **TypeScript** ở chế độ nghiêm ngặt nhất (`Strict Mode`) cho cả hai cổng Frontend và Backend.
- **Frontend Web App:** Sử dụng **React (Vite)** phối hợp với **Tailwind CSS v4** để thiết kế giao diện động, hiện đại và tối ưu hiệu năng render.
- **Backend Service:** Sử dụng **Node.js / Express** chạy trên nền cấu trúc Modular Monolith hướng đối tượng hoặc các Class xử lý tường minh.

### 🏷️ Quy tắc 2.2: Quy ước đặt tên (Naming Conventions)
Mọi thực thể trong mã nguồn phải tuân thủ chuẩn đặt tên nhất quán để tránh nhầm lẫn:
- **Tên biến, tên hàm, tên thuộc tính:** Sử dụng chuẩn `camelCase` (ví dụ: `fetchOrderDetails`, `currentUser`, `paymentStatus`).
- **Tên React Components, Tên Class, Tên Mongoose Models:** Sử dụng chuẩn `PascalCase` (ví dụ: `OrderTrackingPage`, `MainLayout`, `PrescriptionVaultModel`).
- **Tên file & thư mục logic:**
  - File Component React hoặc Trang giao diện: `PascalCase` (ví dụ: `OrderTrackingPage.tsx`).
  - File logic JavaScript/TypeScript, Route, Service, Controller: `kebab-case` hoặc `camelCase` tùy theo chuẩn Module hiện hành, nhưng bắt buộc phải đồng nhất trong cùng một Module (ví dụ: `user-controller.ts`, `productService.ts`).

### 📝 Quy tắc 2.3: Comment & Viết tài liệu trong mã nguồn
- **Mã nguồn tự tường minh (Self-documenting Code):** Đặt tên biến, tên hàm rõ nghĩa và chia nhỏ các hàm phức tạp để bất kỳ ai đọc vào cũng có thể hiểu ngay luồng chạy mà không cần giải thích dài dòng.
- **Quy định viết Comment:** 
  - Chỉ viết comment bằng **Tiếng Việt**.
  - Không viết comment để giải thích mã nguồn đang làm cái gì (**What** - *vì mã nguồn tự giải thích được*).
  - Chỉ dùng comment để giải thích nguyên nhân sâu xa hoặc giải thuật phức tạp tại sao lại viết logic đó (**Why**).
  - *Ví dụ chuẩn:* `// Sử dụng issueDate + 30 ngày để tự động đồng bộ hạn dùng theo đúng Thông tư Y tế quy định hiệu lực đơn.`

---

## 3. 🏗️ Quy tắc Kiến trúc & Tái sử dụng (Architecture Rules)

### 🧩 Quy tắc 3.1: Backend Clean Architecture
- Tuân thủ nghiêm ngặt mô hình phân tách tầng lớp (Layers Separation) của hệ thống Modular Monolith:
  - **Tầng Controllers:** Chỉ làm nhiệm vụ tiếp nhận yêu cầu HTTP, kiểm tra sơ bộ định dạng (Validation) và trả về mã trạng thái HTTP cùng dữ liệu tương ứng. Không chứa logic nghiệp vụ.
  - **Tầng Services (Business Layer):** Nơi xử lý toàn bộ logic nghiệp vụ chính của hệ thống, tính toán, gọi kiểm tra chéo dịch vụ và tương tác với tầng Repository/Model.
  - **Tầng Models:** Nơi định nghĩa thực thể dữ liệu và tương tác trực tiếp với cơ sở dữ liệu MongoDB Atlas.

### ♻️ Quy tắc 3.2: Frontend DRY (Don't Repeat Yourself)
- **Tái sử dụng Component tối đa:** Trước khi tạo mới một nút bấm (Button), ô nhập liệu (Input), hộp thông báo (Modal) hoặc thẻ hiển thị (Card), AI Agent **bắt buộc phải tìm kiếm** trong thư mục `src/components/common/` hoặc các component dùng chung hiện có để tái sử dụng hoặc mở rộng `Props`, tuyệt đối không viết đè mã nguồn trùng lặp.
- Giữ vững tính nhất quán của Hệ thống thiết kế (Design System) bằng cách sử dụng các Utility Classes của Tailwind CSS v4 một cách hệ thống.

### 🧹 Quy tắc 3.3: Xóa bỏ triệt để dữ liệu giả (Clean Mock Data)
- Khi thực hiện tích hợp API thật giữa Frontend và Backend, AI Agent phải **tự động tìm kiếm, rà soát và xóa bỏ hoàn toàn** các đoạn mã nguồn khai báo dữ liệu giả (Mock data) tĩnh cũ trong file UI đó.
- Giao diện phải được kết nối trực tiếp với State Management (Zustand/Redux) hoặc các React Hooks gọi API thực tế qua Axios/Fetch để đảm bảo hệ thống luôn hoạt động bằng dữ liệu thực tế từ Database.

---

## 4. 🔄 Quy trình Git & Báo cáo công việc (Git & Workflow)

Để tối ưu hóa thời gian Pair-Programming và giúp người dùng kiểm soát mã nguồn một cách chuyên nghiệp nhất, AI Agent phải tuân thủ nghiêm ngặt quy trình làm việc sau:

### 💬 Quy tắc 4.1: Giao tiếp súc tích, trực diện (Direct Communication)
- Không xin lỗi dài dòng hoặc mở đầu bằng các câu chào hỏi sáo rỗng.
- Không giải thích lại các kiến thức lập trình cơ bản hoặc lý thuyết hệ thống trừ khi được người dùng yêu cầu hỏi.
- **Công thức báo cáo chuẩn:** *"Tôi đã chỉnh sửa tệp tin X để giải quyết vấn đề Y. Nguyên nhân lỗi nằm ở Z. Dưới đây là mã nguồn thay đổi và kết quả xác thực."*

### 🛠️ Quy tắc 4.2: Cơ chế Git bán tự động (Semi-Automated Git Workflow)
- AI Agent **KHÔNG** tự động push mã nguồn lên nhánh chính.
- Sau khi hoàn thành một nhiệm vụ hoặc giải quyết xong một lỗi hệ thống, AI Agent phải tự động in ra màn hình một khối mã lệnh Git mẫu được chuẩn hóa theo định dạng **Conventional Commits** để người dùng chỉ việc sao chép (copy) và chạy trên terminal của họ.

#### **Mẫu định dạng Git Commit tiêu chuẩn hiển thị:**
```bash
git add .
git commit -m "feat(module): mô tả súc tích tính năng mới bằng tiếng Việt hoặc tiếng Anh"
```
*Hoặc khi sửa lỗi:*
```bash
git add .
git commit -m "fix(module): mô tả lỗi đã được xử lý triệt để"
```
*(Thay thế `module` bằng domain tương ứng: `auth`, `products`, `orders`, `rx`, `cart`, `ci`).*
