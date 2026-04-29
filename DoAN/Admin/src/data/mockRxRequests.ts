export type RxRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RxRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  submittedAt: string;
  imageUrl: string;
  status: RxRequestStatus;
  pharmacistNote?: string;
  totalAmount?: number;
}

export const MOCK_RX_REQUESTS: RxRequest[] = [
  {
    id: 'RX-2026-001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    submittedAt: '2026-04-21T08:30:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+001',
    status: 'PENDING',
    pharmacistNote: 'Cần kiểm tra kỹ liều lượng kháng sinh.',
  },
  {
    id: 'RX-2026-002',
    customerName: 'Trần Thị Bích',
    customerPhone: '0912345678',
    submittedAt: '2026-04-21T09:15:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+002',
    status: 'PENDING',
  },
  {
    id: 'RX-2026-003',
    customerName: 'Lê Hoàng Cường',
    customerPhone: '0987654321',
    submittedAt: '2026-04-20T15:45:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+003',
    status: 'APPROVED',
    pharmacistNote: 'Đã gọi điện tư vấn cách dùng.',
    totalAmount: 450000,
  },
  {
    id: 'RX-2026-004',
    customerName: 'Phạm Thu Dung',
    customerPhone: '0978123456',
    submittedAt: '2026-04-20T10:20:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+004',
    status: 'REJECTED',
    pharmacistNote: 'Ảnh quá mờ, không đọc được tên thuốc.',
  },
  {
    id: 'RX-2026-005',
    customerName: 'Hoàng Văn Em',
    customerPhone: '0934567890',
    submittedAt: '2026-04-21T10:05:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+005',
    status: 'PENDING',
  },
  {
    id: 'RX-2026-006',
    customerName: 'Vũ Thị Hoa',
    customerPhone: '0967890123',
    submittedAt: '2026-04-19T14:30:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+006',
    status: 'APPROVED',
    totalAmount: 125000,
  },
  {
    id: 'RX-2026-007',
    customerName: 'Đặng Minh Khang',
    customerPhone: '0945678901',
    submittedAt: '2026-04-19T09:10:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+007',
    status: 'APPROVED',
    totalAmount: 890000,
  },
  {
    id: 'RX-2026-008',
    customerName: 'Bùi Ngọc Lan',
    customerPhone: '0923456789',
    submittedAt: '2026-04-21T11:45:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+008',
    status: 'PENDING',
    pharmacistNote: 'Toa có thuốc đặc trị, cần duyệt bởi DS trưởng.',
  },
  {
    id: 'RX-2026-009',
    customerName: 'Ngô Tấn Tài',
    customerPhone: '0956789012',
    submittedAt: '2026-04-18T16:20:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+009',
    status: 'REJECTED',
    pharmacistNote: 'Toa thuốc đã hết hạn sử dụng (>5 ngày).',
  },
  {
    id: 'RX-2026-010',
    customerName: 'Lý Mai Phương',
    customerPhone: '0909876543',
    submittedAt: '2026-04-21T13:15:00Z',
    imageUrl: 'https://placehold.co/400x800/e2e8f0/475569?text=Toa+Thuốc+010',
    status: 'PENDING',
  }
];
