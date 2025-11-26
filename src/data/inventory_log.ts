export interface InventoryLog {
  LogID: number;
  ProductID: number;
  ProductName: string;
  Action: 'IMPORT' | 'EXPORT' | 'SALE';
  Quantity: number;
  UnitPrice: number;
  TotalAmount: number;
  Reason?: string;
  PerformedBy: string;
  Timestamp: string;
  Notes?: string;
}

const inventoryLogs: InventoryLog[] = [
  {
    LogID: 1,
    ProductID: 1,
    ProductName: "Chateau Margaux 2015",
    Action: "IMPORT",
    Quantity: 50,
    UnitPrice: 250000,
    TotalAmount: 12500000,
    Reason: "Restocking",
    PerformedBy: "Nguyen Van A",
    Timestamp: "2025-11-25T10:30:00Z",
    Notes: "New batch arrival"
  },
  {
    LogID: 2,
    ProductID: 2,
    ProductName: "Domaine de la Romanée-Conti 2018",
    Action: "SALE",
    Quantity: 2,
    UnitPrice: 650000,
    TotalAmount: 1300000,
    Reason: "Customer purchase",
    PerformedBy: "Tran Thi B",
    Timestamp: "2025-11-25T11:15:00Z"
  },
  {
    LogID: 3,
    ProductID: 5,
    ProductName: "Chardonnay Reserve Sonoma",
    Action: "EXPORT",
    Quantity: 10,
    UnitPrice: 220000,
    TotalAmount: 2200000,
    Reason: "Damaged goods",
    PerformedBy: "Le Van C",
    Timestamp: "2025-11-25T09:45:00Z",
    Notes: "Quality control failure"
  },
  {
    LogID: 4,
    ProductID: 3,
    ProductName: "Opus One 2019",
    Action: "IMPORT",
    Quantity: 25,
    UnitPrice: 300000,
    TotalAmount: 7500000,
    Reason: "New supplier",
    PerformedBy: "Pham Thi D",
    Timestamp: "2025-11-25T08:20:00Z",
    Notes: "Premium stock"
  },
  {
    LogID: 5,
    ProductID: 8,
    ProductName: "Prosecco DOCG",
    Action: "SALE",
    Quantity: 15,
    UnitPrice: 150000,
    TotalAmount: 2250000,
    Reason: "Online order",
    PerformedBy: "Hoang Van E",
    Timestamp: "2025-11-25T12:00:00Z"
  },
  {
    LogID: 6,
    ProductID: 4,
    ProductName: "Penfolds Grange 2016",
    Action: "EXPORT",
    Quantity: 3,
    UnitPrice: 550000,
    TotalAmount: 1650000,
    Reason: "Warehouse transfer",
    PerformedBy: "Do Thi F",
    Timestamp: "2025-11-24T16:30:00Z",
    Notes: "Branch distribution"
  },
  {
    LogID: 7,
    ProductID: 6,
    ProductName: "Sauvignon Blanc Marlborough",
    Action: "IMPORT",
    Quantity: 40,
    UnitPrice: 200000,
    TotalAmount: 8000000,
    Reason: "Seasonal restocking",
    PerformedBy: "Vu Van G",
    Timestamp: "2025-11-24T14:15:00Z"
  },
  {
    LogID: 8,
    ProductID: 1,
    ProductName: "Chateau Margaux 2015",
    Action: "SALE",
    Quantity: 1,
    UnitPrice: 350000,
    TotalAmount: 350000,
    Reason: "Private client",
    PerformedBy: "Nguyen Van A",
    Timestamp: "2025-11-24T18:45:00Z"
  },
  {
    LogID: 9,
    ProductID: 9,
    ProductName: "Rose d'Anjou Loire Valley",
    Action: "IMPORT",
    Quantity: 30,
    UnitPrice: 180000,
    TotalAmount: 5400000,
    Reason: "Festival preparation",
    PerformedBy: "Tran Thi H",
    Timestamp: "2025-11-24T11:00:00Z",
    Notes: "Summer collection"
  },
  {
    LogID: 10,
    ProductID: 7,
    ProductName: "Champagne Brut Prestige",
    Action: "SALE",
    Quantity: 5,
    UnitPrice: 320000,
    TotalAmount: 1600000,
    Reason: "Event catering",
    PerformedBy: "Le Van I",
    Timestamp: "2025-11-24T20:30:00Z"
  },
  {
    LogID: 11,
    ProductID: 10,
    ProductName: "Pinot Noir California",
    Action: "EXPORT",
    Quantity: 8,
    UnitPrice: 260000,
    TotalAmount: 2080000,
    Reason: "Store clearance",
    PerformedBy: "Pham Thi J",
    Timestamp: "2025-11-23T15:20:00Z",
    Notes: "Old inventory removal"
  },
  {
    LogID: 12,
    ProductID: 2,
    ProductName: "Domaine de la Romanée-Conti 2018",
    Action: "IMPORT",
    Quantity: 5,
    UnitPrice: 450000,
    TotalAmount: 2250000,
    Reason: "VIP customer reservation",
    PerformedBy: "Hoang Van K",
    Timestamp: "2025-11-23T13:10:00Z"
  },
  {
    LogID: 13,
    ProductID: 3,
    ProductName: "Opus One 2019",
    Action: "SALE",
    Quantity: 3,
    UnitPrice: 480000,
    TotalAmount: 1440000,
    Reason: "Corporate gift",
    PerformedBy: "Do Thi L",
    Timestamp: "2025-11-23T17:55:00Z"
  },
  {
    LogID: 14,
    ProductID: 5,
    ProductName: "Chardonnay Reserve Sonoma",
    Action: "IMPORT",
    Quantity: 35,
    UnitPrice: 220000,
    TotalAmount: 7700000,
    Reason: "Monthly supply",
    PerformedBy: "Vu Van M",
    Timestamp: "2025-11-22T10:45:00Z"
  },
  {
    LogID: 15,
    ProductID: 8,
    ProductName: "Prosecco DOCG",
    Action: "EXPORT",
    Quantity: 12,
    UnitPrice: 150000,
    TotalAmount: 1800000,
    Reason: "Expired bottles",
    PerformedBy: "Nguyen Van N",
    Timestamp: "2025-11-22T09:30:00Z",
    Notes: "Shelf life exceeded"
  }
];

export default inventoryLogs;
