import { UserProfile, UserAddress, Order } from "../types";

// Mock data
export const currentUser: UserProfile = {
  UserID: 1, // Example UserID
  UserName: "John Doe",
  Email: "john.doe@example.com",
  PhoneNumber: "+1 (555) 123-4567",
  Birthday: "1990-01-01T00:00:00.000Z", // Example Birthday
  ImageURL: "/placeholder-user.jpg",
  Point: 100, // Example Point
  TierName: "Premium", // Example TierName

  // Frontend-specific fields, mapping from API fields
  name: "John Doe", // Mapped from UserName
  memberStatus: "Premium",
  bio: "Passionate wine enthusiast and collector",
  orders: 24,
  favorites: 15,
totalSpent: "2,450 VND",
  avatar: "/placeholder-user.jpg", // Mapped from ImageURL
  verified: true,
  location: "San Francisco, CA",
  joinDate: "January 2023",
};

export const userOrders: Order[] = [
  {
    OrderID: 1,
    UserID: 1,
    UserName: "John Doe",
    Email: "john.doe@example.com",
    PhoneNumber: "+1 (555) 123-4567",
    OrderStreetAddress: "123 Main Street",
    OrderWard: "Ward 1",
    OrderProvince: "San Francisco",
    CreatedAt: "2023-11-15T10:00:00.000Z",
    Subtotal: 89.99,
    DiscountTierID: null,
    DiscountTierValue: null,
    DiscountID: null,
    DiscountValue: null,
    FinalTotal: 89.99,
    StatusID: 1,
    Details: [
      {
        DetailID: 1,
        OrderID: 1,
        ProductID: 1,
        ProductName: "Cabernet Sauvignon 2020",
        Quantity: 1,
        UnitPrice: 89.99,
        DiscountValue: 0,
        FinalItemPrice: 89.99,
      },
    ],
  },
  {
    OrderID: 2,
    UserID: 1,
    UserName: "John Doe",
    Email: "john.doe@example.com",
    PhoneNumber: "+1 (555) 123-4567",
    OrderStreetAddress: "123 Main Street",
    OrderWard: "Ward 1",
    OrderProvince: "San Francisco",
    CreatedAt: "2023-11-10T11:30:00.000Z",
    Subtotal: 65.50,
    DiscountTierID: null,
    DiscountTierValue: null,
    DiscountID: null,
    DiscountValue: null,
    FinalTotal: 65.50,
    StatusID: 2,
    Details: [
      {
        DetailID: 2,
        OrderID: 2,
        ProductID: 2,
        ProductName: "Merlot 2019",
        Quantity: 1,
        UnitPrice: 65.50,
        DiscountValue: 0,
        FinalItemPrice: 65.50,
      },
    ],
  },
  {
    OrderID: 3,
    UserID: 1,
    UserName: "John Doe",
    Email: "john.doe@example.com",
    PhoneNumber: "+1 (555) 123-4567",
    OrderStreetAddress: "123 Main Street",
    OrderWard: "Ward 1",
    OrderProvince: "San Francisco",
    CreatedAt: "2023-10-28T14:45:00.000Z",
    Subtotal: 52.99,
    DiscountTierID: null,
    DiscountTierValue: null,
    DiscountID: null,
    DiscountValue: null,
    FinalTotal: 52.99,
    StatusID: 1,
    Details: [
      {
        DetailID: 3,
        OrderID: 3,
        ProductID: 3,
        ProductName: "Chardonnay 2021",
        Quantity: 1,
        UnitPrice: 52.99,
        DiscountValue: 0,
        FinalItemPrice: 52.99,
      },
    ],
  },
];

export const userAddresses: UserAddress[] = [
  {
    UserAddressID: 1,
    UserID: 1,
    StreetAddress: "123 Main Street",
    Ward: "Ward 1",
    Province: "San Francisco",
    IsDefault: true,
    id: 1, // Mapped from UserAddressID
    type: "Home",
    city: "San Francisco", // Example mapping
    state: "CA", // Example mapping
    zip: "94102",
    country: "USA",
  },
  {
    UserAddressID: 2,
    UserID: 1,
    StreetAddress: "456 Office Plaza",
    Ward: "Ward 2",
    Province: "San Francisco",
    IsDefault: false,
    id: 2, // Mapped from UserAddressID
    type: "Work",
    city: "San Francisco", // Example mapping
    state: "CA", // Example mapping
    zip: "94103",
    country: "USA",
  },
  {
    UserAddressID: 3,
    UserID: 1,
    StreetAddress: "789 Other Road",
    Ward: "Ward 3",
    Province: "Oakland",
    IsDefault: false,
    id: 3, // Mapped from UserAddressID
    type: "Other",
    city: "Oakland", // Example mapping
    state: "CA", // Example mapping
    zip: "94607",
    country: "USA",
  },
];
