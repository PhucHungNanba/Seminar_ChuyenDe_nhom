export interface InventoryItem {
  id: string;
  name: string;
  stockLocations: {
    'Kho Tổng': number;
    'CH Quận 1': number;
    'CH Quận 5': number;
  };
}

export const mockInventory: InventoryItem[] = [
  { id: 'MED-001', name: 'Paracetamol 500mg', stockLocations: { 'Kho Tổng': 1500, 'CH Quận 1': 500, 'CH Quận 5': 1000 } },
  { id: 'MED-002', name: 'Amoxicillin 250mg', stockLocations: { 'Kho Tổng': 45, 'CH Quận 1': 0, 'CH Quận 5': 45 } },
  { id: 'MED-003', name: 'Vitamin C 1000mg', stockLocations: { 'Kho Tổng': 8, 'CH Quận 1': 0, 'CH Quận 5': 8 } },
  { id: 'MED-004', name: 'Lisinopril 10mg', stockLocations: { 'Kho Tổng': 120, 'CH Quận 1': 60, 'CH Quận 5': 60 } },
  { id: 'MED-005', name: 'Metformin 850mg', stockLocations: { 'Kho Tổng': 300, 'CH Quận 1': 150, 'CH Quận 5': 150 } },
];
