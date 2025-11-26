import { RevenueData } from "@/types/dashboard";

export const revenueData: RevenueData = {
  day: {
    labels: [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ],
    data: [1200000, 980000, 1450000, 2300000, 3100000, 2800000, 3500000, 2900000],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [12500000, 15800000, 13200000, 18900000, 22400000, 28500000, 25600000],
  },
  month: {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
    ],
    data: [85400000, 98500000, 125800000, 175500000],
  },
};
