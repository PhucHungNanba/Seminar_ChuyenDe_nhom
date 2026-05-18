# Kiến trúc Cơ Sở Dữ Liệu - Smart Medicine Shop (MongoDB)

## I. PHÂN HỆ QUẢN LÝ NGƯỜI DÙNG (user-service)

### 1. Bảng `users` (Quản lý tài khoản và Phân quyền)
Lưu trữ toàn bộ thông tin định danh, thông tin cá nhân và vai trò tác chiến của mọi thực thể tham gia vào hệ thống.
- **`_id`** *(ObjectId)*: Mã định danh duy nhất tự động sinh bởi MongoDB cho từng tài khoản.
- **`email`** *(String)*: Địa chỉ thư điện tử dùng làm tài khoản đăng nhập (Bắt buộc, duy nhất).
- **`password`** *(String)*: Chuỗi mật khẩu đã được mã hóa băm một chiều (Bcrypt) để bảo mật tuyệt đối.
- **`fullName`** *(String)*: Họ và tên đầy đủ hiển thị trên giao diện hoặc hóa đơn.
- **`phone`** *(String)*: Số điện thoại liên lạc khi giao hàng hoặc xác thực khẩn cấp.
- **`role`** *(String [Enum])*: Vai trò phân quyền truy cập hệ thống:
  - `Admin`: Quản trị viên tối cao, toàn quyền cấu hình kho, nhân sự và xem thống kê doanh thu.
  - `Pharmacist`: Dược sĩ chuyên môn, phụ trách duyệt đơn thuốc y tế, tư vấn và xử lý vận đơn.
  - `Customer`: Khách hàng mua sắm trực tuyến, quản lý sổ sức khỏe cá nhân.
- **`reward_points`** *(Number)*: Số điểm thưởng tích lũy của khách hàng qua từng giao dịch thành công (Mặc định: 0).

---

## II. PHÂN HỆ QUẢN LÝ SẢN PHẨM & DANH MỤC (product-service)

### 2. Bảng `categories` (Phân loại nhóm thuốc)
Lưu trữ danh mục gốc dùng làm bộ lọc phân loại sản phẩm dược phẩm trên giao diện.
- **`_id`** *(ObjectId)*: Mã định danh duy nhất của danh mục.
- **`name`** *(String)*: Tên danh mục hiển thị (Ví dụ: Kháng sinh, Tim mạch, Thiết bị y tế).
- **`slug`** *(String)*: Chuỗi chuẩn hóa không dấu, viết thường phục vụ tối ưu đường dẫn URL.
- **`description`** *(String)*: Mô tả ngắn về phạm vi điều trị của nhóm thuốc.
- **`icon`** *(String)*: Định danh tên biểu tượng hiển thị trực quan ở Frontend (Ví dụ: pill, heart).

### 3. Bảng `products` (Kho thông tin dược phẩm chi tiết)
Quản lý thông tin y khoa, giá bán, hình ảnh và số lượng tồn kho vật lý của từng dòng sản phẩm.
- **`_id`** *(ObjectId)*: Định danh duy nhất cho sản phẩm thuốc.
- **`categoryId`** *(ObjectId)*: Khóa ngoại liên kết trực thuộc danh mục nào trong bảng `categories`.
- **`name`** *(String)*: Tên thương mại của thuốc hiển thị trên kệ hàng trực tuyến.
- **`genericName`** *(String)*: Tên hoạt chất gốc biệt dược y khoa.
- **`manufacturer`** *(String)*: Hãng hoặc tập đoàn dược phẩm sản xuất thuốc.
- **`type`** *(String [Enum])*: Phân loại cơ chế bán hàng: `otc` (Thuốc không kê đơn) hoặc `rx` (Thuốc bắt buộc kê đơn).
- **`form`** *(String [Enum])*: Dạng bào chế vật lý: `tablet` (viên nén), `liquid` (dung dịch sủi), `capsule` (viên nang), `device` (thiết bị y tế).
- **`price`** *(Number)*: Đơn giá bán lẻ niêm yết trên một đơn vị quy đổi.
- **`unit`** *(String)*: Đơn vị tính và quy cách đóng gói hiển thị công khai (Ví dụ: Hộp 10 vỉ x 10 viên).
- **`images`** *(Mảng [String])*: Danh sách các đường dẫn liên kết hình ảnh vật lý của thuốc.
- **`description`** *(String)*: Mô tả tóm tắt tổng quan công dụng.
- **`rating`** *(Number)*: Điểm đánh giá trung bình từ người dùng (Mặc định: 5.0).
- **`reviewCount`** *(Number)*: Tổng số lượt khách hàng viết đánh giá cho sản phẩm.
- **`tags`** *(Mảng [String])*: Từ khóa triệu chứng phục vụ thuật toán tìm kiếm nhanh (Ví dụ: Hạ sốt, Giảm đau).
- **`badge`** *(String)*: Nhãn tiếp thị dán góc sản phẩm (Ví dụ: Bán chạy, Giảm giá).
- **`is_prescription`** *(Boolean)*: Cờ đánh dấu phân loại nhanh dựa theo trường type để kiểm soát giỏ hàng.
- **`stock_quantity`** *(Number)*: Tổng số lượng sản phẩm khả dụng trong kho tổng.
- **`tabs`** *(Object lồng nhau)*: Chứa các thông tin y tế chuyên sâu bắt buộc:
  - `ingredients` *(String)*: Hàm lượng thành phần hóa học cấu thành.
  - `indications` *(String)*: Chỉ định điều trị bệnh lý.
  - `dosage` *(String)*: Hướng dẫn liều lượng dùng cụ thể.
  - `sideEffects` *(String)*: Tác dụng phụ không mong muốn.
- **`inventory`** *(Object lồng nhau)*: Quản lý phân tán số lượng tồn thực tế tại các chi nhánh:
  - `main_warehouse` *(Number)*: Tồn kho tổng điều phối.
  - `branch_q1` *(Number)*: Số lượng khả dụng tại hiệu thuốc chi nhánh Quận 1.
  - `branch_q5` *(Number)*: Số lượng khả dụng tại hiệu thuốc chi nhánh Quận 5.
  - `stock_quantity` *(Number)*: Giá trị tính toán đồng bộ lượng tồn.

---

## III. PHÂN HỆ QUẢN LÝ ĐƠN HÀNG & PHÊ DUYỆT ĐƠN THUỐC (order-service)

### 4. Bảng `orders` (Quản lý giao dịch mua sắm)
Lưu vết trạng thái, vòng đời vận đơn và dòng tiền của các giao dịch trên sàn thương mại điện tử.
- **`_id`** *(ObjectId)*: Định danh duy nhất của đơn hàng.
- **`customerId`** *(ObjectId)*: Khóa ngoại tham chiếu tới người mua hàng trong bảng `users`.
- **`items`** *(Mảng đối tượng)*: Chi tiết danh sách các mặt hàng được chốt mua trong đơn:
  - `productId` *(ObjectId)*: Khóa ngoại trỏ về sản phẩm thuốc trong bảng `products`.
  - `price` *(Number)*: Giá chốt bán cố định tại thời điểm mua (Chống trượt giá lịch sử).
  - `quantity` *(Number)*: Số lượng đặt mua.
- **`prescriptionImage`** *(String)*: Đường dẫn ảnh chụp hóa đơn/đơn thuốc bác sĩ đi kèm nếu đơn chứa thuốc dòng rx.
- **`status`** *(String [Enum])*: Trạng thái xử lý đơn hàng:
  - `DRAFT_RX`: Đơn khởi tạo tạm thời từ ảnh quét OCR chờ Dược sĩ báo giá.
  - `QUOTED`: Đã được Dược sĩ duyệt và báo giá, chờ khách hàng thanh toán.
  - `PENDING_PAYMENT` / `PROCESSING` / `SHIPPING`: Tiến trình vận đơn thông thường.
  - `COMPLETED`: Khách nhận hàng thành công, đóng đơn.
  - `CANCELLED`: Đơn bị hủy bỏ.
- **`pharmacistNotes`** *(String)*: Lời dặn dò y khoa trực tiếp từ Dược sĩ cho người bệnh.
- **`createdAt` & `updatedAt`** *(Date)*: Thời gian tạo và cập nhật trạng thái đơn (Hệ thống tự sinh tự động).

### 5. Bảng `prescriptionvaults` (Hồ sơ Sổ lưu trữ đơn thuốc số hóa)
Lưu trữ kết quả dữ liệu đơn y tế sau khi được số hóa bởi công nghệ AI kết hợp xác nhận từ chuyên môn.
- **`_id`** *(ObjectId)*: Định danh hồ sơ đơn thuốc y khoa.
- **`customerId`** *(ObjectId)*: Khóa ngoại xác định đơn thuốc này thuộc quyền sở hữu của khách hàng nào trong bảng `users`.
- **`prescriptionCode`** *(String)*: Mã số ký hiệu của đơn thuốc do bệnh viện cấp để đối chiếu pháp lý.
- **`issuedDate`** *(Date)*: Ngày Bác sĩ ký ban hành đơn thuốc tại cơ sở y tế.
- **`expiryDate`** *(Date)*: Ngày đơn thuốc hết hiệu lực mua theo quy định pháp luật.
- **`doctorName`** *(String)*: Họ tên đầy đủ của Bác sĩ điều trị kê đơn.
- **`doctorSpecialty`** *(String)*: Chuyên khoa phụ trách điều trị (Ví dụ: Nội tiết, Tim mạch).
- **`hospital`** *(String)*: Tên bệnh viện hoặc cơ sở y tế phát hành đơn thuốc gốc.
- **`diagnosis`** *(String)*: Kết luận bệnh lý lâm sàng.
- **`thumbnailUrl`** *(String)*: Link lưu trữ ảnh chụp quét vật lý của đơn thuốc để kiểm chéo.
- **`notes`** *(String)*: Chỉ dẫn phụ từ Bác sĩ điều trị.
- **`medicines`** *(Mảng đối tượng)*: Danh sách bóc tách chi tiết cấu trúc mảng khớp hoàn toàn với Frontend:
  - `productId` *(ObjectId)*: Khóa ngoại liên kết sản phẩm khớp với kho thuốc thực tế.
  - `name` *(String)*: Tên thuốc bóc tách được từ đơn.
  - `genericName` *(String)*: Tên hoạt chất gốc của dòng thuốc đó.
  - `dosage` *(String)*: Liều lượng chỉ định dùng (Ví dụ: Viên 500mg, uống 2 lần/ngày).
  - `quantity` *(Number)*: Tổng số lượng cấp phát.
  - `price` *(Number)*: Giá niêm yết hiện hành của hệ thống.
  - `imageUrl` *(String)*: Ảnh thu nhỏ phục vụ hiển thị visual trong bệnh án trực quan.

---

## IV. PHÂN HỆ KHAI PHÁ DỮ LIỆU & GỢI Ý THÔNG MINH (ai-service)

### 6. Bảng `associationrules` (Ma trận kết quả luật kết hợp Apriori)
Lưu trữ kết quả tính toán mô hình học máy từ lịch sử giỏ hàng thành công để phục vụ công cụ đề xuất sản phẩm mua kèm tự động.
- **`_id`** *(ObjectId)*: Định danh duy nhất cho luật gợi ý sản phẩm.
- **`antecedentId`** *(ObjectId)*: Khóa ngoại trỏ về sản phẩm gốc (Sản phẩm khách hàng đang xem hoặc chuẩn bị mua).
- **`consequentId`** *(ObjectId)*: Khóa ngoại trỏ về sản phẩm đích (Sản phẩm hệ thống sẽ tự động đề xuất mua kèm thêm).
- **`confidence`** *(Number)*: Độ tin cậy của luật (Khoảng giá trị từ 0.0 đến 1.0).
- **`lift`** *(Number)*: Độ tương quan thể hiện sức mạnh liên kết thực tế của cặp sản phẩm.
- **`support`** *(Number)*: Độ bao phủ tần suất xuất hiện cặp sản phẩm trên toàn bộ dữ liệu sàn.
- **`reason`** *(String)*: Chuỗi văn bản hiển thị lý do gợi ý y khoa trực quan ra Frontend (Ví dụ: Bổ sung men vi sinh giảm tác dụng phụ khi dùng thuốc kháng sinh).
