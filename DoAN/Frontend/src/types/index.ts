export type ProductForm = 'tablet' | 'liquid' | 'capsule' | 'device' | 'effervescent';

export interface TabContent {
  ingredients: string;
  indications: string;
  dosage: string;
  sideEffects: string;
}

export interface Product {
  _id: string;
  productCode?: string;
  categoryId: string;
  name: string;
  genericName: string;
  manufacturer: string;
  type: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device';
  form: ProductForm;
  price: number;
  unit: string;
  images: string[];
  description: string;
  tags: string[];
  badge?: string;
  tabs: TabContent;
  inventory?: {
    main_warehouse: number;
    branch_q1: number;
    branch_q5: number;
    stock_quantity: number;
  };
  stock_quantity?: number;
  is_prescription?: boolean;
}

export interface PrescriptionMedicine {
  productId: string;
  name: string;
  genericName: string;
  dosage: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface SavedPrescription {
  _id: string;
  prescriptionCode: string;
  issuedDate: string;
  issueDate?: string;
  expiryDate: string;
  doctorName: string;
  doctorSpecialty: string;
  hospital: string;
  diagnosis: string;
  thumbnailUrl: string;
  notes: string;
  medicines: PrescriptionMedicine[];
}

export interface AssociationRuleProduct {
  _id: string;
  name: string;
  images: string[];
  price: number;
  type: 'otc' | 'rx' | 'vitamin' | 'personal_care' | 'medical_device';
}

export interface AssociationRule {
  _id: string;
  antecedentId: string;
  consequent: AssociationRuleProduct;
  confidence: number;
  lift: number;
  support: number;
  reason: string;
}
