export interface DiscountProduct {
    DiscountProductID: number;
    ProductName: string;
    DiscountValue: number;   // %
    TimeStart: string;
    TimeEnd: string;
    CreatedAt: string;
    UpdatedAt: string;
  }

  export const discountProducts : DiscountProduct[]  = [
    { DiscountProductID: 1, ProductName: "Château Margaux 2015", DiscountValue: 10, TimeStart: "2025-11-20", TimeEnd: "2025-11-30", CreatedAt: "2025-10-01", UpdatedAt: "2025-10-01" },
    { DiscountProductID: 2, ProductName: "Penfolds Grange 2018", DiscountValue: 12, TimeStart: "2025-12-01", TimeEnd: "2025-12-15", CreatedAt: "2025-10-02", UpdatedAt: "2025-10-02" },
    { DiscountProductID: 3, ProductName: "Robert Mondavi Cabernet Sauvignon", DiscountValue: 8, TimeStart: "2025-10-10", TimeEnd: "2025-10-20", CreatedAt: "2025-09-01", UpdatedAt: "2025-09-01" },
    { DiscountProductID: 4, ProductName: "Antinori Tignanello 2019", DiscountValue: 15, TimeStart: "2025-07-01", TimeEnd: "2025-07-10", CreatedAt: "2025-06-01", UpdatedAt: "2025-06-01" },
    { DiscountProductID: 5, ProductName: "Vega Sicilia Único 2014", DiscountValue: 20, TimeStart: "2025-03-01", TimeEnd: "2025-03-05", CreatedAt: "2025-02-10", UpdatedAt: "2025-02-10" },
    { DiscountProductID: 6, ProductName: "Gaja Barbaresco", DiscountValue: 14, TimeStart: "2025-04-01", TimeEnd: "2025-04-08", CreatedAt: "2025-03-01", UpdatedAt: "2025-03-01" },
    { DiscountProductID: 7, ProductName: "Cloudy Bay Sauvignon Blanc", DiscountValue: 7, TimeStart: "2025-05-10", TimeEnd: "2025-05-15", CreatedAt: "2025-04-20", UpdatedAt: "2025-04-20" },
    { DiscountProductID: 8, ProductName: "Moët & Chandon Imperial", DiscountValue: 10, TimeStart: "2025-12-20", TimeEnd: "2025-12-31", CreatedAt: "2025-11-20", UpdatedAt: "2025-11-20" },
    { DiscountProductID: 9, ProductName: "Dom Pérignon Vintage 2013", DiscountValue: 18, TimeStart: "2025-12-25", TimeEnd: "2026-01-02", CreatedAt: "2025-11-15", UpdatedAt: "2025-11-15" },
    { DiscountProductID: 10, ProductName: "Château Lafite Rothschild 2014", DiscountValue: 25, TimeStart: "2025-11-01", TimeEnd: "2025-11-05", CreatedAt: "2025-10-01", UpdatedAt: "2025-10-01" },
  
    { DiscountProductID: 11, ProductName: "Opus One 2018", DiscountValue: 12, TimeStart: "2025-08-01", TimeEnd: "2025-08-07", CreatedAt: "2025-07-01", UpdatedAt: "2025-07-01" },
    { DiscountProductID: 12, ProductName: "Sassicaia 2019", DiscountValue: 15, TimeStart: "2025-09-01", TimeEnd: "2025-09-10", CreatedAt: "2025-08-10", UpdatedAt: "2025-08-10" },
    { DiscountProductID: 13, ProductName: "Catena Zapata Malbec Argentino", DiscountValue: 9, TimeStart: "2025-06-01", TimeEnd: "2025-06-05", CreatedAt: "2025-05-01", UpdatedAt: "2025-05-01" },
    { DiscountProductID: 14, ProductName: "Torres Mas La Plana", DiscountValue: 8, TimeStart: "2025-04-01", TimeEnd: "2025-04-10", CreatedAt: "2025-03-15", UpdatedAt: "2025-03-15" },
    { DiscountProductID: 15, ProductName: "Yellow Tail Shiraz", DiscountValue: 5, TimeStart: "2025-03-01", TimeEnd: "2025-03-10", CreatedAt: "2025-02-10", UpdatedAt: "2025-02-10" },
    { DiscountProductID: 16, ProductName: "Barefoot Moscato", DiscountValue: 6, TimeStart: "2025-02-01", TimeEnd: "2025-02-05", CreatedAt: "2025-01-10", UpdatedAt: "2025-01-10" },
    { DiscountProductID: 17, ProductName: "Chandon Brut Rosé", DiscountValue: 11, TimeStart: "2025-07-10", TimeEnd: "2025-07-15", CreatedAt: "2025-06-20", UpdatedAt: "2025-06-20" },
    { DiscountProductID: 18, ProductName: "Beringer Napa Valley Merlot", DiscountValue: 9, TimeStart: "2025-10-01", TimeEnd: "2025-10-08", CreatedAt: "2025-09-01", UpdatedAt: "2025-09-01" },
    { DiscountProductID: 19, ProductName: "Silver Oak Cabernet Sauvignon", DiscountValue: 20, TimeStart: "2025-11-05", TimeEnd: "2025-11-12", CreatedAt: "2025-10-05", UpdatedAt: "2025-10-05" },
    { DiscountProductID: 20, ProductName: "Kim Crawford Sauvignon Blanc", DiscountValue: 7, TimeStart: "2025-05-01", TimeEnd: "2025-05-06", CreatedAt: "2025-04-01", UpdatedAt: "2025-04-01" }
  ];
  