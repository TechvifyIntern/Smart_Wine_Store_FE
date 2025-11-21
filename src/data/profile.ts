// src/lib/types.ts
export interface UserProfile {
  name: string;
  memberStatus: string;
  bio: string;
  orders: number | string;
  favorites: number | string;
  totalSpent: string;
  avatar: string;
  verified: boolean;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
}

export interface Address {
  id: string | number;
  isDefault: boolean;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string | number;
  image: string;
  product: string;
  date: string;
  total: string;
  status: 'Delivered' | 'In Transit' | 'Pending' | string;
}

// Mock data
export const currentUser: UserProfile = {
  name: "John Doe",
  memberStatus: "Premium",
  bio: "Passionate wine enthusiast and collector",
  orders: 24,
  favorites: 15,
  totalSpent: "$2,450",
  avatar: "/placeholder-user.jpg",
  verified: true,
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  joinDate: "January 2023"
};

export const userOrders: Order[] = [
  {
    id: "#12345",
    image: "/placeholder.jpg",
    product: "Cabernet Sauvignon 2020",
    date: "Nov 15, 2023",
    total: "$89.99",
    status: "Delivered"
  },
  {
    id: "#12344",
    image: "/placeholder.jpg",
    product: "Merlot 2019",
    date: "Nov 10, 2023",
    total: "$65.50",
    status: "In Transit"
  },
  {
    id: "#12343",
    image: "/placeholder.jpg",
    product: "Chardonnay 2021",
    date: "Oct 28, 2023",
    total: "$52.99",
    status: "Delivered"
  }
];

export const userAddresses: Address[] = [
  {
    id: 1,
    isDefault: true,
    type: "Home",
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "USA"
  },
  {
    id: 2,
    isDefault: false,
    type: "Work",
    street: "456 Office Plaza",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    country: "USA"
  }
];
