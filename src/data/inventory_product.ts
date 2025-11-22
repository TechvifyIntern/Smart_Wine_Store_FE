interface InventoryProduct {
  ProductID: string;
  ProductName: string;
  ImageURL: string;
  Quantity: number;
  CostPrice: number;
  SalePrice: number;
}


const inventoryProducts: InventoryProduct[] = [
  { "ProductID": "P001", "ProductName": "Chardonnay Reserve", "ImageURL": "https://picsum.photos/seed/1/100/100", "Quantity": 120, "CostPrice": 150000, "SalePrice": 250000 },
  { "ProductID": "P002", "ProductName": "Merlot Classic", "ImageURL": "https://picsum.photos/seed/2/100/100", "Quantity": 80, "CostPrice": 130000, "SalePrice": 220000 },
  { "ProductID": "P003", "ProductName": "Cabernet Sauvignon", "ImageURL": "https://picsum.photos/seed/3/100/100", "Quantity": 200, "CostPrice": 180000, "SalePrice": 300000 },
  { "ProductID": "P004", "ProductName": "Pinot Noir", "ImageURL": "https://picsum.photos/seed/4/100/100", "Quantity": 150, "CostPrice": 160000, "SalePrice": 280000 },
  { "ProductID": "P005", "ProductName": "Riesling Sweet", "ImageURL": "https://picsum.photos/seed/5/100/100", "Quantity": 100, "CostPrice": 140000, "SalePrice": 240000 },
  { "ProductID": "P006", "ProductName": "Sauvignon Blanc", "ImageURL": "https://picsum.photos/seed/6/100/100", "Quantity": 90, "CostPrice": 135000, "SalePrice": 230000 },
  { "ProductID": "P007", "ProductName": "Syrah Red", "ImageURL": "https://picsum.photos/seed/7/100/100", "Quantity": 70, "CostPrice": 145000, "SalePrice": 255000 },
  { "ProductID": "P008", "ProductName": "Zinfandel", "ImageURL": "https://picsum.photos/seed/8/100/100", "Quantity": 110, "CostPrice": 155000, "SalePrice": 265000 },
  { "ProductID": "P009", "ProductName": "Malbec", "ImageURL": "https://picsum.photos/seed/9/100/100", "Quantity": 95, "CostPrice": 125000, "SalePrice": 215000 },
  { "ProductID": "P010", "ProductName": "Tempranillo", "ImageURL": "https://picsum.photos/seed/10/100/100", "Quantity": 130, "CostPrice": 165000, "SalePrice": 275000 },
  { "ProductID": "P011", "ProductName": "Grenache", "ImageURL": "https://picsum.photos/seed/11/100/100", "Quantity": 85, "CostPrice": 145000, "SalePrice": 260000 },
  { "ProductID": "P012", "ProductName": "Barbera", "ImageURL": "https://picsum.photos/seed/12/100/100", "Quantity": 75, "CostPrice": 140000, "SalePrice": 250000 },
  { "ProductID": "P013", "ProductName": "Viognier", "ImageURL": "https://picsum.photos/seed/13/100/100", "Quantity": 60, "CostPrice": 150000, "SalePrice": 265000 },
  { "ProductID": "P014", "ProductName": "Nebbiolo", "ImageURL": "https://picsum.photos/seed/14/100/100", "Quantity": 55, "CostPrice": 160000, "SalePrice": 270000 },
  { "ProductID": "P015", "ProductName": "Moscato", "ImageURL": "https://picsum.photos/seed/15/100/100", "Quantity": 100, "CostPrice": 130000, "SalePrice": 220000 },
  { "ProductID": "P016", "ProductName": "Petit Verdot", "ImageURL": "https://picsum.photos/seed/16/100/100", "Quantity": 90, "CostPrice": 155000, "SalePrice": 265000 },
  { "ProductID": "P017", "ProductName": "Sangiovese", "ImageURL": "https://picsum.photos/seed/17/100/100", "Quantity": 80, "CostPrice": 140000, "SalePrice": 240000 },
  { "ProductID": "P018", "ProductName": "Carmenere", "ImageURL": "https://picsum.photos/seed/18/100/100", "Quantity": 110, "CostPrice": 150000, "SalePrice": 260000 },
  { "ProductID": "P019", "ProductName": "Cabernet Franc", "ImageURL": "https://picsum.photos/seed/19/100/100", "Quantity": 95, "CostPrice": 145000, "SalePrice": 255000 },
  { "ProductID": "P020", "ProductName": "Gamay", "ImageURL": "https://picsum.photos/seed/20/100/100", "Quantity": 120, "CostPrice": 160000, "SalePrice": 280000 },
  { "ProductID": "P021", "ProductName": "Touriga Nacional", "ImageURL": "https://picsum.photos/seed/21/100/100", "Quantity": 70, "CostPrice": 135000, "SalePrice": 230000 },
  { "ProductID": "P022", "ProductName": "Albarino", "ImageURL": "https://picsum.photos/seed/22/100/100", "Quantity": 65, "CostPrice": 130000, "SalePrice": 225000 },
  { "ProductID": "P023", "ProductName": "Torrontes", "ImageURL": "https://picsum.photos/seed/23/100/100", "Quantity": 85, "CostPrice": 140000, "SalePrice": 235000 },
  { "ProductID": "P024", "ProductName": "Gewurztraminer", "ImageURL": "https://picsum.photos/seed/24/100/100", "Quantity": 90, "CostPrice": 145000, "SalePrice": 240000 },
  { "ProductID": "P025", "ProductName": "Petit Sirah", "ImageURL": "https://picsum.photos/seed/25/100/100", "Quantity": 100, "CostPrice": 150000, "SalePrice": 250000 },
  { "ProductID": "P026", "ProductName": "Barolo", "ImageURL": "https://picsum.photos/seed/26/100/100", "Quantity": 75, "CostPrice": 160000, "SalePrice": 270000 },
  { "ProductID": "P027", "ProductName": "Chenin Blanc", "ImageURL": "https://picsum.photos/seed/27/100/100", "Quantity": 85, "CostPrice": 135000, "SalePrice": 230000 },
  { "ProductID": "P028", "ProductName": "Cabernet Blend", "ImageURL": "https://picsum.photos/seed/28/100/100", "Quantity": 110, "CostPrice": 155000, "SalePrice": 265000 },
  { "ProductID": "P029", "ProductName": "White Zinfandel", "ImageURL": "https://picsum.photos/seed/29/100/100", "Quantity": 90, "CostPrice": 140000, "SalePrice": 240000 },
  { "ProductID": "P030", "ProductName": "Red Blend", "ImageURL": "https://picsum.photos/seed/30/100/100", "Quantity": 120, "CostPrice": 150000, "SalePrice": 250000 }
]
export default inventoryProducts;