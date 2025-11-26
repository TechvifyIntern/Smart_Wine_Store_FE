export interface DiscountOrder {
    DiscountOrderID: number;
    DiscountValue: number;        // %
    MinimumOrderValue: number;    // price
    UpdatedAt?: string;
  }
  
export const discountOrders : DiscountOrder[] = [
    { DiscountOrderID: 1, DiscountValue: 5, MinimumOrderValue: 300000, UpdatedAt: "2025-10-01" },
    { DiscountOrderID: 2, DiscountValue: 7, MinimumOrderValue: 500000, UpdatedAt: "2025-10-02" },
    { DiscountOrderID: 3, DiscountValue: 10, MinimumOrderValue: 800000, UpdatedAt: "2025-10-03" },
    { DiscountOrderID: 4, DiscountValue: 12, MinimumOrderValue: 1000000, UpdatedAt: "2025-10-04" },
    { DiscountOrderID: 5, DiscountValue: 15, MinimumOrderValue: 1500000, UpdatedAt: "2025-10-05" },
    { DiscountOrderID: 6, DiscountValue: 18, MinimumOrderValue: 2000000, UpdatedAt: "2025-10-06" },
    { DiscountOrderID: 7, DiscountValue: 20, MinimumOrderValue: 2500000, UpdatedAt: "2025-10-07" },
    { DiscountOrderID: 8, DiscountValue: 8, MinimumOrderValue: 450000, UpdatedAt: "2025-10-08" },
    { DiscountOrderID: 9, DiscountValue: 6, MinimumOrderValue: 350000, UpdatedAt: "2025-10-09" },
    { DiscountOrderID: 10, DiscountValue: 9, MinimumOrderValue: 600000, UpdatedAt: "2025-10-10" },
  
    { DiscountOrderID: 11, DiscountValue: 11, MinimumOrderValue: 900000, UpdatedAt: "2025-10-11" },
    { DiscountOrderID: 12, DiscountValue: 13, MinimumOrderValue: 1200000, UpdatedAt: "2025-10-12" },
    { DiscountOrderID: 13, DiscountValue: 17, MinimumOrderValue: 1800000, UpdatedAt: "2025-10-13" },
    { DiscountOrderID: 14, DiscountValue: 19, MinimumOrderValue: 2200000, UpdatedAt: "2025-10-14" },
    { DiscountOrderID: 15, DiscountValue: 21, MinimumOrderValue: 3000000, UpdatedAt: "2025-10-15" },
    { DiscountOrderID: 16, DiscountValue: 25, MinimumOrderValue: 5000000, UpdatedAt: "2025-10-16" },
    { DiscountOrderID: 17, DiscountValue: 4, MinimumOrderValue: 200000, UpdatedAt: "2025-10-17" },
    { DiscountOrderID: 18, DiscountValue: 30, MinimumOrderValue: 8000000, UpdatedAt: "2025-10-18" },
    { DiscountOrderID: 19, DiscountValue: 22, MinimumOrderValue: 3500000, UpdatedAt: "2025-10-19" },
    { DiscountOrderID: 20, DiscountValue: 28, MinimumOrderValue: 6000000, UpdatedAt: "2025-10-20" }
  ];
  