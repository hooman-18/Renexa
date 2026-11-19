export type UserRole = 'supplier' | 'buyer';

export type PageRoute =
  | 'home'
  | 'marketplace'
  | 'supplier-dashboard'
  | 'buyer-dashboard'
  | 'add-listing'
  | 'post-requirement'
  | 'material-details'
  | 'how-it-works'
  | 'requests';

export type MaterialCategory =
  | 'Metal Scrap'
  | 'Aluminium'
  | 'Copper'
  | 'Steel'
  | 'Plastic'
  | 'Paper and Cardboard'
  | 'Packaging Waste'
  | 'Other Recoverable Materials';

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'Metal Scrap',
  'Aluminium',
  'Copper',
  'Steel',
  'Plastic',
  'Paper and Cardboard',
  'Packaging Waste',
  'Other Recoverable Materials',
];

export type QuantityUnit = 'KG' | 'TON';

export type QuoteStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed';

export type MatchLabel =
  | 'Strong Potential Match'
  | 'Partial Match'
  | 'Additional Verification Required';

export interface MaterialListing {
  id: string;
  name: string;
  category: MaterialCategory;
  type: string;
  grade: string;
  quantity: number;
  unit: QuantityUnit;
  expectedPrice?: number; // INR per unit (optional)
  location: string;
  description: string;
  imageUrl?: string;
  supplierName: string;
  supplierContactRole?: string;
  status: 'Active' | 'Paused';
  isSampleData: boolean;
  createdAt: string;
  updatedAt?: string;
  specifications?: {
    condition: string;
    packaging: string;
    dispatchWindow: string;
    hazardClassification: string;
  };
}

export interface BuyerRequirement {
  id: string;
  requiredMaterial: string;
  category: MaterialCategory;
  materialType?: string;
  requiredQuantity: number;
  unit: QuantityUnit;
  preferredGrade: string;
  budget?: number; // INR per unit (optional)
  preferredLocation: string;
  additionalRequirements: string;
  buyerCompanyName: string;
  isSampleData: boolean;
  createdAt: string;
}

export interface QuotationRequest {
  id: string;
  referenceCode: string;
  materialId: string;
  materialName: string;
  materialCategory: MaterialCategory;
  supplierName: string;
  buyerCompanyName: string;
  contactPerson: string;
  requiredQuantity: number;
  unit: QuantityUnit;
  offeredPrice?: number;
  expectedPrice?: number;
  message: string;
  status: QuoteStatus;
  isSampleData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  role: UserRole | 'both';
  action: string;
  detail: string;
  timestamp: string;
  relatedPage?: PageRoute;
  relatedId?: string;
}

export interface MatchResult {
  listing: MaterialListing;
  label: MatchLabel;
  score: number;
  reasons: string[];
  verificationNotes: string[];
  criteriaBreakdown: {
    category: boolean;
    typeOrKeyword: boolean;
    grade: boolean;
    quantity: 'sufficient' | 'partial' | 'insufficient';
    location: 'exact' | 'regional' | 'other';
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}
