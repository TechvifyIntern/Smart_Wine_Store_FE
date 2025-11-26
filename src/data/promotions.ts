export interface Promotion {
  id: number;
  name: string;
  originalPrice: string;
  discountedPrice: string;
  image: string;
  discount: string;
}

export const promotions: Promotion[] = [
  {
    id: 1,
    name: "Cabernet Sauvignon",
originalPrice: "150.00 VND",
discountedPrice: "120.00 VND",
    image: "",
    discount: "20% OFF",
  },
  {
    id: 2,
    name: "Chardonnay Reserve",
originalPrice: "80.00 VND",
discountedPrice: "64.00 VND",
    image: "",
    discount: "20% OFF",
  },
  {
    id: 3,
    name: "Merlot Classic",
originalPrice: "95.00 VND",
discountedPrice: "76.00 VND",
    image: "",
    discount: "20% OFF",
  },
  {
    id: 4,
    name: "Sauvignon Blanc",
originalPrice: "70.00 VND",
discountedPrice: "49.00 VND",
    image: "",
    discount: "30% OFF",
  },
];
