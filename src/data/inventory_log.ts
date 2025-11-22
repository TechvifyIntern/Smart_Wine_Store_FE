export interface InventoryLog {
  InventoryLogID: number;
  TransactionType: "Import" | "Export";
  UserID: number;
  Username: string;
  Email: string;
  InventoryID: number;
  ProductName: string;
  Quantity: number;
  Date: string;
}

const inventoryLogs: InventoryLog[] = [
  { "InventoryLogID": 1, "TransactionType": "Import", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 1, "ProductName": "Chardonnay Reserve", "Quantity": 50, "Date": "2025-11-21T10:30:00"},
  { "InventoryLogID": 2, "TransactionType": "Export", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 2, "ProductName": "Merlot Classic", "Quantity": 20, "Date": "2025-11-21T11:00:00" },
  { "InventoryLogID": 3, "TransactionType": "Import", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 3, "ProductName": "Cabernet Sauvignon", "Quantity": 100, "Date": "2025-11-21T12:00:00"  },
  { "InventoryLogID": 4, "TransactionType": "Export", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 4, "ProductName": "Pinot Noir", "Quantity": 30, "Date": "2025-11-21T13:00:00",  },
  { "InventoryLogID": 5, "TransactionType": "Import", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 5, "ProductName": "Riesling Sweet", "Quantity": 40, "Date": "2025-11-21T14:00:00"},
  { "InventoryLogID": 6, "TransactionType": "Export", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 6, "ProductName": "Sauvignon Blanc", "Quantity": 15, "Date": "2025-11-21T15:00:00" },
  { "InventoryLogID": 7, "TransactionType": "Import", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 7, "ProductName": "Syrah Red", "Quantity": 60, "Date": "2025-11-21T16:00:00" },
  { "InventoryLogID": 8, "TransactionType": "Export", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 8, "ProductName": "Zinfandel", "Quantity": 25, "Date": "2025-11-21T17:00:00"},
  { "InventoryLogID": 9, "TransactionType": "Import", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 9, "ProductName": "Malbec", "Quantity": 70, "Date": "2025-11-21T18:00:00"},
  { "InventoryLogID": 10, "TransactionType": "Export", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 10, "ProductName": "Tempranillo", "Quantity": 35, "Date": "2025-11-21T19:00:00"},
  { "InventoryLogID": 11, "TransactionType": "Import", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 11, "ProductName": "Grenache", "Quantity": 45, "Date": "2025-11-21T20:00:00"},
  { "InventoryLogID": 12, "TransactionType": "Export", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 12, "ProductName": "Barbera", "Quantity": 20, "Date": "2025-11-21T21:00:00"},
  { "InventoryLogID": 13, "TransactionType": "Import", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 13, "ProductName": "Viognier", "Quantity": 50, "Date": "2025-11-22T08:00:00" },
  { "InventoryLogID": 14, "TransactionType": "Export", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 14, "ProductName": "Nebbiolo", "Quantity": 15, "Date": "2025-11-22T09:00:00"},
  { "InventoryLogID": 15, "TransactionType": "Import", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 15, "ProductName": "Moscato", "Quantity": 40, "Date": "2025-11-22T10:00:00"},
  { "InventoryLogID": 16, "TransactionType": "Export", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 16, "ProductName": "Petit Verdot", "Quantity": 20, "Date": "2025-11-22T11:00:00"},
  { "InventoryLogID": 17, "TransactionType": "Import", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 17, "ProductName": "Sangiovese", "Quantity": 60, "Date": "2025-11-22T12:00:00"},
  { "InventoryLogID": 18, "TransactionType": "Export", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 18, "ProductName": "Carmenere", "Quantity": 25, "Date": "2025-11-22T13:00:00" },
  { "InventoryLogID": 19, "TransactionType": "Import", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 19, "ProductName": "Cabernet Franc", "Quantity": 70, "Date": "2025-11-22T14:00:00"},
  { "InventoryLogID": 20, "TransactionType": "Export", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 20, "ProductName": "Gamay", "Quantity": 30, "Date": "2025-11-22T15:00:00" },
  { "InventoryLogID": 21, "TransactionType": "Import", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 21, "ProductName": "Touriga Nacional", "Quantity": 50, "Date": "2025-11-22T16:00:00"},
  { "InventoryLogID": 22, "TransactionType": "Export", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 22, "ProductName": "Albarino", "Quantity": 20, "Date": "2025-11-22T17:00:00"},
  { "InventoryLogID": 23, "TransactionType": "Import", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 23, "ProductName": "Torrontes", "Quantity": 60, "Date": "2025-11-22T18:00:00"},
  { "InventoryLogID": 24, "TransactionType": "Export", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 24, "ProductName": "Gewurztraminer", "Quantity": 25, "Date": "2025-11-22T19:00:00"},
  { "InventoryLogID": 25, "TransactionType": "Import", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 25, "ProductName": "Petit Sirah", "Quantity": 80, "Date": "2025-11-22T20:00:00"},
  { "InventoryLogID": 26, "TransactionType": "Export", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 26, "ProductName": "Barolo", "Quantity": 30, "Date": "2025-11-22T21:00:00"},
  { "InventoryLogID": 27, "TransactionType": "Import", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 27, "ProductName": "Chenin Blanc", "Quantity": 50, "Date": "2025-11-23T08:00:00"},
  { "InventoryLogID": 28, "TransactionType": "Export", "UserID": 103, "Username": "admin3", "Email": "admin3@example.com", "InventoryID": 28, "ProductName": "Cabernet Blend", "Quantity": 20, "Date": "2025-11-23T09:00:00"},
  { "InventoryLogID": 29, "TransactionType": "Import", "UserID": 102, "Username": "admin2", "Email": "admin2@example.com", "InventoryID": 29, "ProductName": "White Zinfandel", "Quantity": 70, "Date": "2025-11-23T10:00:00" },
  { "InventoryLogID": 30, "TransactionType": "Export", "UserID": 101, "Username": "admin1", "Email": "admin1@example.com", "InventoryID": 30, "ProductName": "Red Blend", "Quantity": 35, "Date": "2025-11-23T11:00:00" }
]
export default inventoryLogs;