export const navigationLinks = [
  { label: "Products", href: "/Wine" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export const childrenCate = [
  { CategoryID: 3, CategoryName: "Red Wine" },
  { CategoryID: 4, CategoryName: "White Wine" },
  { CategoryID: 5, CategoryName: "Rose Wine" },
  { CategoryID: 6, CategoryName: "Sparkling Wine" },
  { CategoryID: 7, CategoryName: "Dessert Wine" },
];

export const childrenOfchild = [
  { CategoryID: 8, CategoryName: "Scotch Whisky", CategoryParentID: 3 },
  { CategoryID: 9, CategoryName: "Bourbon", CategoryParentID: 3 },
  { CategoryID: 10, CategoryName: "Irish Whiskey", CategoryParentID: 4 },
  { CategoryID: 11, CategoryName: "Japanese Whisky", CategoryParentID: 3 },
  { CategoryID: 12, CategoryName: "Single Malt", CategoryParentID: 5 },
];
