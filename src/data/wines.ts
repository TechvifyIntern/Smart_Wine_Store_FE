export interface Wine {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

export const wines: Wine[] = [
  {
    id: 1,
    name: "Chateau Margaux",
    price: "299.990 VND",
    image: "",
    description: "A premium red wine from Bordeaux.",
  },
  {
    id: 2,
    name: "Domaine de la Romanée-Conti",
price: "499.99 VND",
    image: "",
    description: "Legendary Pinot Noir from Burgundy.",
  },
  {
    id: 3,
    name: "Opus One",
price: "179.99 VND",
    image: "",
    description: "Exceptional Cabernet Sauvignon blend.",
  },
  {
    id: 4,
    name: "Penfolds Grange",
price: "399.99 VND",
    image: "",
    description: "Iconic Australian Shiraz.",
  },
];

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Red Wines",
    description: "Bold and rich varieties",
    icon: "Wine",
  },
  {
    id: 2,
    name: "White Wines",
    description: "Crisp and refreshing",
    icon: "Sparkles",
  },
  {
    id: 3,
    name: "Sparkling Wines",
    description: "Celebration essentials",
    icon: "Sparkle",
  },
  {
    id: 4,
    name: "Rosé Wines",
    description: "Light and fruity",
    icon: "Cherry",
  },
];
