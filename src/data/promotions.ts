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
    originalPrice: "$150.00",
    discountedPrice: "$120.00",
    image: "https://via.placeholder.com/250x200/000000/FFFFFF?text=Promo+Wine+1",
    discount: "20% OFF",
  },
  {
    id: 2,
    name: "Chardonnay Reserve",
    originalPrice: "$80.00",
    discountedPrice: "$64.00",
    image: "https://via.placeholder.com/250x200/FFFFFF/000000?text=Promo+Wine+2",
    discount: "20% OFF",
  },
  {
    id: 3,
    name: "Merlot Classic",
    originalPrice: "$95.00",
    discountedPrice: "$76.00",
    image: "https://via.placeholder.com/250x200/333333/FFFFFF?text=Promo+Wine+3",
    discount: "20% OFF",
  },
  {
    id: 4,
    name: "Sauvignon Blanc",
    originalPrice: "$70.00",
    discountedPrice: "$49.00",
    image: "https://via.placeholder.com/250x200/000000/FFFFFF?text=Promo+Wine+4",
    discount: "30% OFF",
  },
];
