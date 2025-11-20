export interface DiscountTier {
    DiscountTierID: number;
    Tier: "Gold" | "Silver" | "Bronze";
    MinimumPoint: number;
  }
  

export const discountTiers : DiscountTier[] = [
    { DiscountTierID: 1, Tier: "Gold", MinimumPoint: 5000 },
    { DiscountTierID: 2, Tier: "Silver", MinimumPoint: 3000 },
    { DiscountTierID: 3, Tier: "Bronze", MinimumPoint: 1500 },
    { DiscountTierID: 4, Tier: "Gold", MinimumPoint: 5500 },
    { DiscountTierID: 5, Tier: "Silver", MinimumPoint: 2800 },
    { DiscountTierID: 6, Tier: "Bronze", MinimumPoint: 1200 },
    { DiscountTierID: 7, Tier: "Gold", MinimumPoint: 6000 },
    { DiscountTierID: 8, Tier: "Silver", MinimumPoint: 2500 },
    { DiscountTierID: 9, Tier: "Bronze", MinimumPoint: 1000 },
    { DiscountTierID: 10, Tier: "Gold", MinimumPoint: 6500 },
  
    { DiscountTierID: 11, Tier: "Silver", MinimumPoint: 3200 },
    { DiscountTierID: 12, Tier: "Bronze", MinimumPoint: 800 },
    { DiscountTierID: 13, Tier: "Gold", MinimumPoint: 7000 },
    { DiscountTierID: 14, Tier: "Silver", MinimumPoint: 3500 },
    { DiscountTierID: 15, Tier: "Bronze", MinimumPoint: 500 },
    { DiscountTierID: 16, Tier: "Gold", MinimumPoint: 7500 },
    { DiscountTierID: 17, Tier: "Silver", MinimumPoint: 4000 },
    { DiscountTierID: 18, Tier: "Bronze", MinimumPoint: 2000 },
    { DiscountTierID: 19, Tier: "Gold", MinimumPoint: 8000 },
    { DiscountTierID: 20, Tier: "Silver", MinimumPoint: 3800 }
  ];
  