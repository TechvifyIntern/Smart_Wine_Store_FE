"use client";

import { useParams } from "next/navigation";
import { discountTiers } from "@/data/discount_tier";
import accounts from "@/data/accounts";
import PageHeader from "@/components/discount-events/PageHeader";
import { Users, Crown, Gem, Medal } from "lucide-react";

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

export default function TierDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const tier = discountTiers.find((t) => t.DiscountTierID === id);
  if (!tier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tier Not Found</h2>
          <p className="text-gray-600">The requested tier could not be found.</p>
        </div>
      </div>
    );
  }

  const tierUsers = accounts.filter((account) => account.TierName === tier.Tier);

  const style = tierStyles[tier.Tier];
  const Icon = style.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader title={`${tier.Tier} Tier Details`} icon={Users} iconColor="text-slate-700" />

        {/* Hero Section */}
        <div className={`relative overflow-hidden rounded-3xl ${style.bgColor} ${style.bgColorDark} shadow-2xl`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
                  <Icon className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    {tier.Tier} Tier
                  </h1>
                  <div className={`px-6 py-2 ${style.badgeBg} text-white text-lg font-semibold rounded-full shadow-lg`}>
                    Premium
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <p className="text-sm font-medium mb-1">Minimum Points Required</p>
                    <p className="text-2xl font-bold">{tier.MinimumPoint.toLocaleString()} pts</p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <p className="text-sm font-medium mb-1">Total Members</p>
                    <p className="text-2xl font-bold">{tierUsers.length.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Members in {tier.Tier} Tier</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{tierUsers.length} Total</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tierUsers.map((user, index) => (
                  <tr
                    key={user.UserID}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    } hover:bg-slate-100/50 transition-all duration-200 group`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      #{user.UserID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {user.UserName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.Email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.PhoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.RoleName === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        user.RoleName === 'Seller' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.RoleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {user.Point.toLocaleString()} pts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        user.StatusName === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        user.StatusName === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {user.StatusName}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tierUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">No Members Found</h4>
              <p className="text-slate-600">This tier currently has no members.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
