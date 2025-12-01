import { api } from "@/services/api";
import { AI_ROUTES } from "@/services/chat/constants";

export type RecommendedProduct = {
  product_id: number;
  name: string;
  img_link: string;
  type: string;
  abv: string;
  volumn: number;
  price: number;
  discount_value: number;
  similarity_score: number;
};

// Hàm gọi API gợi ý
export const getRecommendedProducts = async (
  orderData: any
): Promise<RecommendedProduct[]> => {
  const body = convertOldToNew(orderData);
  try {
    const res = await api.post<RecommendedProduct[]>(
      AI_ROUTES.RECOMENDATION,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

type OldDetail = {
  DetailID: number;
  DiscountValue: number;
  FinalItemPrice: number;
  OrderID: number;
  ProductID: number;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
};

type OldData = {
  CreatedAt: string;
  Details: OldDetail[];
  DiscountEventValue: number;
  DiscountTierValue: number;
  Email: string;
  FinalTotal: number;
  OrderID: number;
  OrderProvince: string;
  OrderStreetAddress: string;
  OrderWard: string;
  PhoneNumber: string;
  StatusID: number;
  Subtotal: number;
  UserID: number;
  UserName: string;
  message: string;
  paymentMethod?: string;
  paymentMethodID?: number;
  requiresPayment?: boolean;
};

type OldJSON = {
  success: boolean;
  statusCode: number;
  message: string;
  data: OldData;
};

type NewDetail = {
  DetailID: number;
  OrderID: number;
  ProductID: number;
  ProductName: string;
  Quantity: number;
  UnitPrice: number;
  DiscountValue: number;
  FinalItemPrice: number;
};

type NewData = {
  OrderID: number;
  UserID: number;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  OrderStreetAddress: string;
  OrderWard: string;
  OrderProvince: string;
  CreatedAt: string;
  Subtotal: number;
  DiscountTierID: number;
  DiscountTierValue: number;
  DiscountID: number;
  DiscountValue: number;
  FinalTotal: number;
  StatusID: number;
  Details: NewDetail[];
};

type NewJSON = {
  statusCode: number;
  message: string;
  data: NewData;
};

function convertOldToNew(oldJson: OldJSON): NewJSON {
  return {
    statusCode: oldJson.statusCode,
    message: oldJson.message,
    data: {
      OrderID: oldJson.data.OrderID,
      UserID: oldJson.data.UserID,
      UserName: oldJson.data.UserName,
      Email: oldJson.data.Email,
      PhoneNumber: oldJson.data.PhoneNumber,
      OrderStreetAddress: oldJson.data.OrderStreetAddress,
      OrderWard: oldJson.data.OrderWard,
      OrderProvince: oldJson.data.OrderProvince,
      CreatedAt: oldJson.data.CreatedAt,
      Subtotal: oldJson.data.Subtotal,
      DiscountTierID: 0,
      DiscountTierValue: oldJson.data.DiscountTierValue,
      DiscountID: 0,
      DiscountValue: oldJson.data.DiscountEventValue,
      FinalTotal: oldJson.data.FinalTotal,
      StatusID: oldJson.data.StatusID,
      Details: oldJson.data.Details.map((detail) => ({
        DetailID: detail.DetailID,
        OrderID: detail.OrderID,
        ProductID: detail.ProductID,
        ProductName: detail.ProductName,
        Quantity: detail.Quantity,
        UnitPrice: detail.UnitPrice,
        DiscountValue: detail.DiscountValue,
        FinalItemPrice: detail.FinalItemPrice,
      })),
    },
  };
}
