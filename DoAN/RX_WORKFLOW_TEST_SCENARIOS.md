# Prescription (Rx) Workflow - E2E Test Scenarios

## Overview
This document describes the complete 5-step prescription workflow for the Smart Medicine Shop system, where customers can order prescription drugs by uploading their prescriptions and pharmacists can review, quote, and process the orders.

---

## Test Scenario: Complete Rx Workflow (5 Steps)

### Demo Credentials
- **Customer Account**
  - Email: `customer@gmail.com`
  - Password: `Password123!`

- **Admin/Pharmacist Account** (if applicable)
  - Available in Admin Portal at `/admin/rx-approval`

---

## Step 1: Customer Uploads Prescription

**Description**: Customer logs in to the frontend and uploads a prescription image for a medicine they wish to order.

**Entry Point**: http://localhost:5173/

**Actions**:
1. Navigate to homepage
2. Click on a medicine product card (e.g., "Ibuprofen 400mg")
3. Click "Tải lên đơn thuốc" (Upload Prescription) button
4. Modal opens: `#modal-upload-{productId}`
5. User selects or drags an image file into upload field
6. Clicks "Gửi" (Submit) button to upload
7. System displays success message

**Expected Outcomes**:
- Prescription file uploaded to Cloudinary
- Database records prescription with:
  - `status: "PENDING"` (pending pharmacist review)
  - `customerId`: User ID
  - `productId`: Product ID
  - `uploadedAt`: Current timestamp
- Customer sees confirmation toast/modal
- Rx appears in customer's "Orders" page with status "PENDING"

**UI Elements**:
- Product card selector: `.product-card` or similar
- Upload button: `#open-rx-modal-${productId}`
- Modal: `#modal-upload-${productId}`
- Submit button: Button with text "Gửi"

**Success Criteria**:
- ✅ File uploaded successfully to Cloudinary
- ✅ Database record created with PENDING status
- ✅ Success notification displayed
- ✅ Prescription visible in customer's order history

---

## Step 2: Pharmacist Reviews and Quotes

**Description**: Pharmacist (Admin) logs into admin portal, reviews the uploaded prescription, searches for alternative medicines, and creates a quote with pricing.

**Entry Point**: http://localhost:5174/admin/rx-approval

**Actions**:
1. Navigate to Admin RX Approval page
2. See list of pending prescriptions (status: PENDING)
3. Click on prescription to review
4. View uploaded prescription image
5. Search for alternative/substitute medicines in the system
6. Select medicines and add to "Quote Builder"
7. Set quantities and prices for each medicine
8. Click "Hoàn tất & Gửi báo giá" (Complete & Send Quote) button
9. System sends quote to customer

**Expected Outcomes**:
- Prescription status updates to `"QUOTED"` (quote provided)
- Quote record created with:
  - `prescriptionId`: Reference to prescription
  - `medicines`: Array of selected medicines with quantities/prices
  - `totalPrice`: Sum of all selected items
  - `quotedAt`: Current timestamp
  - `expiresAt`: Quote expiration date (e.g., +7 days)
- Customer receives notification that quote is ready
- Prescription appears on customer's "Orders" page with status "QUOTED"

**UI Elements**:
- Pending Rx list: Table showing prescriptions with status PENDING
- Rx detail view: Shows uploaded image
- Medicine search: Input field to find medicines
- Quote builder: Component to add medicines and set quantities
- Submit button: "Hoàn tất & Gửi báo giá"

**Success Criteria**:
- ✅ Pharmacist can view uploaded prescription image
- ✅ Pharmacist can search and select medicines
- ✅ Quote created with accurate pricing
- ✅ Prescription status changed to QUOTED in database
- ✅ Customer notified of new quote

---

## Step 3: Customer Accepts Quote and Makes Payment

**Description**: Customer reviews the pharmacist's quote and accepts it by proceeding to payment.

**Entry Point**: http://localhost:5173/orders

**Actions**:
1. Navigate to Orders page
2. Find Rx with status "QUOTED" (quote ready)
3. Click on the order/quote to view details
4. Review medicine list, quantities, and total price
5. Click "Chấp nhận & Thanh toán" (Accept & Pay) button
6. Proceed to checkout page
7. Complete payment (can be simulated)
8. Confirm order

**Expected Outcomes**:
- Quote status updates to `"ACCEPTED"`
- Order created in Order Service with:
  - `status: "PENDING"` (waiting for admin to ship)
  - `items`: Medicines from accepted quote
  - `totalPrice`: Quoted price
  - `paymentStatus: "COMPLETED"`
  - `acceptedAt`: Current timestamp
- Prescription status updates to `"ACCEPTED"`
- Customer sees confirmation message
- Order appears in customer's orders with status "PENDING" (awaiting shipment)

**UI Elements**:
- Orders list: Show prescriptions/orders
- Quote detail view: Display medicine items and prices
- Accept button: "Chấp nhận & Thanh toán"
- Checkout page: `/checkout`

**Success Criteria**:
- ✅ Quote displayed with all medicine details
- ✅ Customer can accept quote
- ✅ Payment processed (or simulated)
- ✅ Order status changed to PENDING in database
- ✅ Order appears in order history

---

## Step 4: Admin Updates Order Status to Shipped

**Description**: Admin/Pharmacist updates the order status to "SHIPPED" to indicate the order has been dispatched.

**Entry Point**: http://localhost:5174/admin/orders

**Actions**:
1. Navigate to Admin Orders page
2. Find order with status "PENDING" (awaiting shipment)
3. Click on order to open details
4. Click "Cập nhật trạng thái" or similar button
5. Select status "ĐÃ GIAO" (Shipped) or "ĐANG GIAO" (In Transit)
6. Optionally add tracking number
7. Click "Lưu" (Save) or "Gửi" (Submit)

**Expected Outcomes**:
- Order status updates to `"SHIPPING"` or `"SHIPPED"`
- Order record updated with:
  - `status: "SHIPPING"`
  - `shippedAt`: Current timestamp
  - `trackingNumber`: If provided
- Customer receives notification (email/in-app) that order is shipped
- Order appears in customer's order tracking with status "SHIPPING"

**UI Elements**:
- Orders list: Table of orders
- Order detail: Shows order information and status options
- Status dropdown: Select new status
- Save button: "Lưu" or "Gửi"

**Success Criteria**:
- ✅ Admin can change order status
- ✅ Order status updated to SHIPPING in database
- ✅ Customer notified of shipment
- ✅ Order tracking shows updated status

---

## Step 5: Customer Tracks Order Status

**Description**: Customer views the order tracking page and verifies the order status has progressed through the workflow (pending → packing → shipping → delivered).

**Entry Point**: http://localhost:5173/orders/{orderId}

**Actions**:
1. Navigate to order detail page
2. Find order tracking section with progress stepper
3. Verify stepper shows current status: "ĐANG GIAO" (Shipping)
4. View order items, tracking number (if available)
5. See estimated delivery date
6. Monitor order progress

**Expected Outcomes**:
- Order tracking page displays stepper with steps:
  - Step 1: "Chờ xử lý" (Pending) - ✅ Completed
  - Step 2: "Đang đóng gói" (Packing) - ✅ Completed
  - Step 3: "Đang giao hàng" (Shipping) - 🔄 Current
  - Step 4: "Đã giao" (Delivered) - ⏳ Pending
- Current step highlighted/animated
- Order details displayed: items, prices, tracking info
- Estimated delivery date shown

**UI Elements**:
- Order tracking page: `/orders/{orderId}`
- Stepper component: Shows 4 steps with progress
- Current status indicator: Highlighted/animated step
- Order summary: Item details, total, tracking

**Success Criteria**:
- ✅ Order tracking page loads with correct order
- ✅ Stepper displays all 4 steps
- ✅ Current step is highlighted as SHIPPING
- ✅ Order details accurately reflect the database state
- ✅ Customer can monitor order progress

---

## Test Data Requirements

### Sample Medicine Product
```json
{
  "_id": "product_id",
  "name": "Ibuprofen 400mg",
  "description": "Pain reliever",
  "price": 50000,
  "quantity": 100,
  "productCode": "IBU-400"
}
```

### Sample Prescription File
- Format: PNG/JPG image
- Size: < 5MB
- Content: Clear photo of a prescription form

### Database Seeding
Before running tests, ensure:
1. At least one product exists in db_products
2. Demo customer account exists in db_users
3. MongoDB collections initialized

---

## Automation Considerations

### Browser Contexts
- **Customer Context**: Headless browser at port 5173 (Frontend)
- **Admin Context**: Second headless browser at port 5174 (Admin Portal)
- Both contexts run simultaneously to simulate real workflow

### File Upload Handling
- Use `fileChooser.setFiles()` for Prescription image upload
- Support both drag-drop and click-to-upload methods
- Validate file appears in Cloudinary

### Async Operations
- Wait for API responses after each action
- Handle database consistency delays (use appropriate waits)
- Poll for status updates (e.g., prescription status changes)

### Error Handling
- Validate error messages for edge cases
- Test with invalid file formats
- Test with missing/incomplete prescription data

### Test Execution Time
- **Single workflow**: ~30-60 seconds
- **Parallel execution** (2 browsers): ~40-80 seconds
- Includes waits for API responses and UI updates

---

## Related UI Components

### Frontend Components
- [PrescriptionUploader.tsx](Frontend/src/components/...)
- [OrdersListPage](Frontend/src/pages/Orders/...)
- [OrderTrackingPage](Frontend/src/pages/Orders/...)
- [MedicineDetail](Frontend/src/pages/MedicineDetail/...)

### Admin Components
- [RxApprovalPage](Admin/src/pages/RxApproval/...)
- [OrdersPage](Admin/src/pages/Orders/...)

### API Endpoints
- `POST /api/users/login` - Customer login
- `POST /api/orders/prescriptions/upload` - Upload prescription
- `GET /api/orders/prescriptions/{id}` - Get prescription details
- `POST /api/orders/quotes` - Create quote
- `POST /api/orders/{id}/accept-quote` - Accept quote
- `PATCH /api/orders/{id}/status` - Update order status
- `GET /api/orders/{id}` - Get order details

---

## Notes for Developers

1. **Environment**: Tests require docker-compose services running (Frontend, Admin, Backend APIs)
2. **Timeouts**: Adjust wait times based on system performance
3. **Selectors**: Update UI element selectors if component structure changes
4. **Authentication**: Tests use demo credentials; ensure account exists before running
5. **Data Cleanup**: Consider clearing test data after each run
6. **CI/CD Integration**: Can be integrated into GitHub Actions or similar
