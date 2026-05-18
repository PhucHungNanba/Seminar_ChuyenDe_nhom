export interface InventoryItem {
  _id: string;
  name: string;
  stockLocations: {
    'Kho Tổng': number;
    'CH Quận 1': number;
    'CH Quận 5': number;
    [key: string]: number;
  };
}

export interface RxRequest {
  _id: string;
  prescriptionCode?: string;
  customerPhone: string;
  imageUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  totalAmount?: number;
}
