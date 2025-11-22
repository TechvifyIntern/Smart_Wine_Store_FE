import { UserGrowthData } from "@/types/dashboard";

export const userGrowthData: UserGrowthData = {
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
    data: [5, 3, 8, 12, 25, 18, 32, 28],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [85, 102, 95, 128, 145, 192, 178],
  },
  month: {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
    ],
    data: [245, 312, 398, 478],
  },
};
