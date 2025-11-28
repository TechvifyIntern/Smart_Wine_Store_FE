// UserProfile based on the first JSON and extended with frontend needs
export interface UserProfile {
  UserID: number;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  Birthday: string; // ISO 8601 string
  ImageURL: string | null;
  Point: number;
  TierName: string;
  createAt?: string;
  orders?: number;
  favorites?: number;
  totalSpent?: number;
  // Additional frontend-specific fields from src/data/profile.ts
}

// UserAddress based on the second JSON
export interface UserAddress {
  UserAddressID: number;
  UserID: number;
  StreetAddress: string;
  Ward: string;
  Province: string;
  IsDefault: boolean;
}

// OrderDetail based on the nested 'Details' array in the third JSON
export interface OrderDetail {
  DetailID: number;
  OrderID: number;
  ProductID: number;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
  DiscountValue: number;
  FinalItemPrice: number;
}

// Order based on the third JSON
export interface Order {
  OrderID: number;
  UserID: number;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  OrderStreetAddress: string;
  OrderWard: string;
  OrderProvince: string;
  CreatedAt: string; // ISO 8601 string
  Subtotal: number;
  DiscountTierID: number | null; // Assuming it can be null
  DiscountTierValue: number | null; // Assuming it can be null
  DiscountID: number | null; // Assuming it can be null
  DiscountValue: number;
  FinalTotal: number;
  StatusID: number;
  Details: OrderDetail[];
}

export interface UpdateProfilePayload {
  UserName?: string;
  Email?: string;
  PhoneNumber?: string;
  Birthday?: string;
  ImageURL?: string;
}

export interface AddAddressPayload {
  StreetAddress: string;
  Ward: string;
  Province: string;
  IsDefault: boolean;
}

export interface UpdateAddressPayload {
  StreetAddress?: string;
  Ward?: string;
  Province?: string;
  IsDefault?: boolean;
}
