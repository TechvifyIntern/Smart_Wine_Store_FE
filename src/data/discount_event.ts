export interface DiscountEvent {
    DiscountEventID: number;
    EventName: string;
    Description: string;
    DiscountValue: number;     // %
    TimeStart: string;         // ISO string
    TimeEnd: string;           // ISO string
    CreatedAt: string;
    UpdatedAt: string;
  }
  
  export const discountEvents: DiscountEvent[] = [
    { DiscountEventID: 1, EventName: "Black Friday Wine Sale", Description: "Giảm sâu cho rượu vang đỏ", DiscountValue: 30, TimeStart: "2025-11-20", TimeEnd: "2025-11-30", CreatedAt: "2025-10-01", UpdatedAt: "2025-10-01" },
    { DiscountEventID: 2, EventName: "Christmas Wine Fest", Description: "Ưu đãi mùa Giáng Sinh", DiscountValue: 25, TimeStart: "2025-12-15", TimeEnd: "2025-12-31", CreatedAt: "2025-11-10", UpdatedAt: "2025-11-10" },
    { DiscountEventID: 3, EventName: "New Year Cheers", Description: "Rượu Champagne chào năm mới", DiscountValue: 20, TimeStart: "2025-12-30", TimeEnd: "2026-01-05", CreatedAt: "2025-12-10", UpdatedAt: "2025-12-10" },
    { DiscountEventID: 4, EventName: "Summer Wine Week", Description: "Ưu đãi rượu vang trắng mùa hè", DiscountValue: 18, TimeStart: "2025-06-01", TimeEnd: "2025-06-10", CreatedAt: "2025-05-01", UpdatedAt: "2025-05-01" },
    { DiscountEventID: 5, EventName: "French Wine Day", Description: "Ưu đãi rượu vang Pháp", DiscountValue: 22, TimeStart: "2025-04-20", TimeEnd: "2025-04-25", CreatedAt: "2025-03-15", UpdatedAt: "2025-03-15" },
    { DiscountEventID: 6, EventName: "Italy Premium Sale", Description: "Rượu Ý hảo hạng giảm giá", DiscountValue: 15, TimeStart: "2025-08-10", TimeEnd: "2025-08-20", CreatedAt: "2025-07-01", UpdatedAt: "2025-07-01" },
    { DiscountEventID: 7, EventName: "Spain Rioja Week", Description: "Rượu vang đỏ Rioja giảm giá", DiscountValue: 12, TimeStart: "2025-02-05", TimeEnd: "2025-02-12", CreatedAt: "2025-01-15", UpdatedAt: "2025-01-15" },
    { DiscountEventID: 8, EventName: "Wine Lover’s Day", Description: "Ngày vàng cho tín đồ rượu vang", DiscountValue: 28, TimeStart: "2025-02-14", TimeEnd: "2025-02-14", CreatedAt: "2025-01-10", UpdatedAt: "2025-01-10" },
    { DiscountEventID: 9, EventName: "Premium Red Wine Month", Description: "Ưu đãi vang đỏ cao cấp", DiscountValue: 35, TimeStart: "2025-09-01", TimeEnd: "2025-09-30", CreatedAt: "2025-08-10", UpdatedAt: "2025-08-10" },
    { DiscountEventID: 10, EventName: "Australia Shiraz Sale", Description: "Giảm giá rượu Úc", DiscountValue: 18, TimeStart: "2025-03-01", TimeEnd: "2025-03-07", CreatedAt: "2025-02-01", UpdatedAt: "2025-02-01" },
  
    { DiscountEventID: 11, EventName: "California Wine Week", Description: "Rượu Mỹ giảm giá", DiscountValue: 14, TimeStart: "2025-07-10", TimeEnd: "2025-07-18", CreatedAt: "2025-06-20", UpdatedAt: "2025-06-20" },
    { DiscountEventID: 12, EventName: "Cabernet Sauvignon Sale", Description: "Dòng Cabernet giảm mạnh", DiscountValue: 20, TimeStart: "2025-01-15", TimeEnd: "2025-01-20", CreatedAt: "2024-12-30", UpdatedAt: "2024-12-30" },
    { DiscountEventID: 13, EventName: "Chile Wine Fest", Description: "Rượu Chile giá tốt", DiscountValue: 10, TimeStart: "2025-03-10", TimeEnd: "2025-03-17", CreatedAt: "2025-02-05", UpdatedAt: "2025-02-05" },
    { DiscountEventID: 14, EventName: "Argentina Malbec Day", Description: "Ưu đãi rượu Malbec", DiscountValue: 16, TimeStart: "2025-04-05", TimeEnd: "2025-04-08", CreatedAt: "2025-03-01", UpdatedAt: "2025-03-01" },
    { DiscountEventID: 15, EventName: "Sparkling Wine Week", Description: "Rượu vang sủi giảm giá", DiscountValue: 25, TimeStart: "2025-12-01", TimeEnd: "2025-12-07", CreatedAt: "2025-11-01", UpdatedAt: "2025-11-01" },
    { DiscountEventID: 16, EventName: "Rosé Summer Sale", Description: "Rượu vang hồng giảm giá", DiscountValue: 12, TimeStart: "2025-07-01", TimeEnd: "2025-07-05", CreatedAt: "2025-06-05", UpdatedAt: "2025-06-05" },
    { DiscountEventID: 17, EventName: "Wine Combo Week", Description: "Combo rượu giá ưu đãi", DiscountValue: 18, TimeStart: "2025-10-02", TimeEnd: "2025-10-10", CreatedAt: "2025-09-01", UpdatedAt: "2025-09-01" },
    { DiscountEventID: 18, EventName: "Vintage Wine Day", Description: "Rượu vintage giảm giá", DiscountValue: 40, TimeStart: "2025-05-15", TimeEnd: "2025-05-17", CreatedAt: "2025-04-01", UpdatedAt: "2025-04-01" },
    { DiscountEventID: 19, EventName: "Importer Sale", Description: "Hàng nhập khẩu giảm giá", DiscountValue: 22, TimeStart: "2025-01-10", TimeEnd: "2025-01-18", CreatedAt: "2024-12-15", UpdatedAt: "2024-12-15" },
    { DiscountEventID: 20, EventName: "Monthly Flash Sale", Description: "Sự kiện flash sale hàng tháng", DiscountValue: 30, TimeStart: "2025-11-01", TimeEnd: "2025-11-02", CreatedAt: "2025-10-10", UpdatedAt: "2025-10-10" }
  ];
  
  