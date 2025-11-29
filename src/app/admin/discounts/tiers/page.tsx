"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "@/components/discount-events/PageHeader";
import { Users, Edit2, Crown, Gem, Medal, Info } from "lucide-react";
import { DiscountTier } from "@/data/discount_tier";
import { discountTiers } from "@/data/discount_tier";
import discountTiersRepository from "@/api/discountTiersRepository";
import { toast } from "sonner";

const tierStyles: Record<string, any> = {
  Gold: {
    bgColor: "bg-[#FFD700]",
    bgColorDark: "dark:bg-[#FFD700]/80",
    badgeBg: "bg-[#DAA520]",
    icon: Crown,
  },
  Silver: {
    bgColor: "bg-[#C0C0C0]",
    bgColorDark: "dark:bg-[#C0C0C0]/80",
    badgeBg: "bg-[#A9A9A9]",
    icon: Gem,
  },
  Bronze: {
    bgColor: "bg-[#CD7F32]",
    bgColorDark: "dark:bg-[#CD7F32]/80",
    badgeBg: "bg-[#8B4513]",
    icon: Medal,
  },
};

export default function TierPage() {
  const [tiersData, setTiersData] = useState<DiscountTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch discount tiers from API
  useEffect(() => {
    const loadDiscountTiers = async () => {
      try {
        setIsLoading(true);
        const response = await discountTiersRepository.getDiscountTiers();
        if (response.success && response.data) {
          console.log('Loaded discount tiers:', response.data); // Debug: see what API returns
          setTiersData(response.data as any);
        } else {
          console.error('Failed to load discount tiers from API:', response.message);
          // Use fallback sample data
          console.log('Using fallback sample data');
          setTiersData(discountTiers);
          toast.warning('Using sample data as API is unavailable');
        }
      } catch (err) {
        console.error('Error loading discount tiers from API:', err);
        // Use fallback sample data
        console.log('Using fallback sample data');
        setTiersData(discountTiers);
        toast.warning('Using sample data as API is unavailable');
      } finally {
        setIsLoading(false);
      }
    };
    loadDiscountTiers();
  }, []);

  // Tính tổng thành viên
  // (fake demo: random userCount)
  const tiersWithUsers = tiersData.map((tier) => {
    // Map DiscountTierID to tier name
    let tierName: "Bronze" | "Silver" | "Gold" = "Bronze";
    if (tier.DiscountTierID === 1) tierName = "Bronze";
    else if (tier.DiscountTierID === 2) tierName = "Silver";
    else if (tier.DiscountTierID === 3) tierName = "Gold";

    return {
      ...tier,
      Tier: tierName,
      userCount: Math.floor(Math.random() * 500) + 50,
    };
  });

  const totalUsers = tiersWithUsers.reduce(
    (sum, tier) => sum + tier.userCount,
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Tier Management" icon={Users} iconColor="text-black" />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>

          {/* Stats Overview */}
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm">Total Members</p>
                <p className="text-2xl font-semibold">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tier Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiersWithUsers.map((tier) => {
              const style = tierStyles[tier.Tier] || tierStyles["Bronze"]; // Fallback to Bronze if tier not found
              const Icon = style?.icon || Medal; // Fallback to Medal icon

              const percentage = ((tier.userCount / totalUsers) * 100).toFixed(1);

              return (
                <Link
                  key={tier.DiscountTierID}
                  href={`/admin/discounts/tiers/${tier.DiscountTierID}`}
                  className="rounded-xl border overflow-hidden dark:border-[#202123] transition-all duration-300 hover:shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer block"
                >
                  {/* Card Header */}
                  <div className={`${style?.bgColor || 'bg-gray-300'} ${style?.bgColorDark || 'dark:bg-gray-700'} px-5 py-4 border-b`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-6">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold">{tier.Tier}</h3>
                      </div>

                      {/* Không có discountPercent → chỉ là badge */}
                      <span
                        className={`${style?.badgeBg || 'bg-gray-500'} text-white text-sm font-semibold px-3 py-1 rounded-full`}
                      >
                        Tier
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 dark:bg-[#100f0f]">
                    {/* Minimum Points */}
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-1">
                        Minimum Point Required
                      </p>
                      <p className="text-lg font-semibold">
                        {tier.MinimumPoint ? tier.MinimumPoint.toLocaleString() : '0'} pts
                      </p>
                    </div>

                    {/* Active Members */}
                    <div>
                      <p className="text-xs uppercase tracking-wide mb-1">
                        Active Members
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">
                          {tier.userCount ? tier.userCount.toLocaleString() : '0'}
                        </p>
                        <span className="text-sm">({percentage}%)</span>
                      </div>
                    </div>

                    {/* Distribution Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Distribution</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${style?.badgeBg || 'bg-gray-500'} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button className="group w-full mt-2 px-4 py-2.5 border text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:transform hover:scale-[1.02]">
                      <Edit2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                      Edit Tier
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <span className="font-medium">Note:</span> Members automatically
              upgrade when they reach the minimum point threshold.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
