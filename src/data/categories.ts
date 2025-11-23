export interface Category {
  CategoryID: number;                 
  CategoryName: string;                
  Description?: string | null;         
  CategoryParentID?: number | null;    
  CategoryParentName?: string | null;  
  ProductCount?: number;               
}

export const mockCategories: Category[] = [
  { CategoryID: 1, CategoryName: "Red Wine", Description: "Premium red wines", ProductCount: 12 },
  { CategoryID: 2, CategoryName: "White Wine", Description: "Crisp white wines", ProductCount: 10 },
  { CategoryID: 3, CategoryName: "Sparkling Wine", Description: "Champagnes and sparkling wines", ProductCount: 8 },
  { CategoryID: 4, CategoryName: "Rosé Wine", Description: "Rosé selections", ProductCount: 5 },
  { CategoryID: 5, CategoryName: "Dessert Wine", Description: "Sweet dessert wines", ProductCount: 4 },
  { CategoryID: 6, CategoryName: "Organic Wine", Description: "Organic wines", ProductCount: 6 },
  { CategoryID: 7, CategoryName: "Wine Sets", Description: "Gift sets and collections", ProductCount: 7 },
  { CategoryID: 8, CategoryName: "Beverages", Description: "Non-alcoholic drinks", ProductCount: 15 },
  { CategoryID: 9, CategoryName: "Juices", Description: "Fresh fruit juices", CategoryParentID: 8, CategoryParentName: "Beverages", ProductCount: 5 },
  { CategoryID: 10, CategoryName: "Sparkling Water", Description: "Carbonated water", CategoryParentID: 8, CategoryParentName: "Beverages", ProductCount: 4 },
  { CategoryID: 11, CategoryName: "Soft Drinks", Description: "Cola, soda, etc.", CategoryParentID: 8, CategoryParentName: "Beverages", ProductCount: 6 },
  { CategoryID: 12, CategoryName: "Beer", Description: "Craft and commercial beers", ProductCount: 9 },
  { CategoryID: 13, CategoryName: "Craft Beer", Description: "Local craft beers", CategoryParentID: 12, CategoryParentName: "Beer", ProductCount: 4 },
  { CategoryID: 14, CategoryName: "Imported Beer", Description: "International beers", CategoryParentID: 12, CategoryParentName: "Beer", ProductCount: 5 },
  { CategoryID: 15, CategoryName: "Spirits", Description: "Whiskey, Vodka, Gin", ProductCount: 12 },
  { CategoryID: 16, CategoryName: "Whiskey", Description: "Aged whiskeys", CategoryParentID: 15, CategoryParentName: "Spirits", ProductCount: 6 },
  { CategoryID: 17, CategoryName: "Vodka", Description: "Premium vodka", CategoryParentID: 15, CategoryParentName: "Spirits", ProductCount: 3 },
  { CategoryID: 18, CategoryName: "Gin", Description: "Craft and classic gins", CategoryParentID: 15, CategoryParentName: "Spirits", ProductCount: 3 },
  { CategoryID: 19, CategoryName: "Accessories", Description: "Wine glasses, corkscrews", ProductCount: 10 },
  { CategoryID: 20, CategoryName: "Glassware", Description: "Wine glasses and decanters", CategoryParentID: 19, CategoryParentName: "Accessories", ProductCount: 4 },
  { CategoryID: 21, CategoryName: "Openers", Description: "Corkscrews and openers", CategoryParentID: 19, CategoryParentName: "Accessories", ProductCount: 3 },
  { CategoryID: 22, CategoryName: "Decanters", Description: "Decanter sets", CategoryParentID: 19, CategoryParentName: "Accessories", ProductCount: 3 },
  { CategoryID: 23, CategoryName: "Gift Cards", Description: "Gift cards and vouchers", ProductCount: 5 },
  { CategoryID: 24, CategoryName: "Seasonal Promotions", Description: "Limited time offers", ProductCount: 7 },
  { CategoryID: 25, CategoryName: "Organic Beverages", Description: "Organic drinks", CategoryParentID: 8, CategoryParentName: "Beverages", ProductCount: 3 },
  { CategoryID: 26, CategoryName: "Non-Alcoholic Wine", Description: "Wine alternatives without alcohol", ProductCount: 2 },
  { CategoryID: 27, CategoryName: "Rosé Sparkling", Description: "Rosé sparkling wines", CategoryParentID: 3, CategoryParentName: "Sparkling Wine", ProductCount: 2 },
  { CategoryID: 28, CategoryName: "Fortified Wine", Description: "Port, Sherry, Madeira", ProductCount: 3 },
  { CategoryID: 29, CategoryName: "Vermouth", Description: "Aromatic fortified wine", CategoryParentID: 28, CategoryParentName: "Fortified Wine", ProductCount: 1 },
  { CategoryID: 30, CategoryName: "Limited Edition", Description: "Rare or exclusive wines", ProductCount: 2 },
];
