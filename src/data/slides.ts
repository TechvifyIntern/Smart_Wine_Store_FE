export interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    image: "/images/slides/Red_Wines.png",
    title: "Premium Red Wines",
    subtitle: "Discover our finest selection of aged red wines",
  },
  {
    id: 2,
    image: "/images/slides/White_Wines.png",
    title: "Elegant White Wines",
    subtitle: "Crisp and refreshing wines for every occasion",
  },
  {
    id: 3,
    image: "/images/slides/Champagne.png",
    title: "Champagne & Sparkling",
    subtitle: "Celebrate with our premium sparkling collection",
  },
];
