export interface DiscountTier {
    DiscountTierID: number;
    Tier: "Gold" | "Silver" | "Bronze";
    MinimumPoint: number;
  }
  

export const discountTiers : DiscountTier[] = [
    { DiscountTierID: 1, Tier: "Gold", MinimumPoint: 5000000 },
    { DiscountTierID: 2, Tier: "Silver", MinimumPoint: 3000000 },
    { DiscountTierID: 3, Tier: "Bronze", MinimumPoint: 1500000},
  ];
  