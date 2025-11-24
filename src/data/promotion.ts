const promotions = [
    {
        id: 1,
        name: "Black Friday Sale",
        description: "50% off on selected red wines",
        discountType: "Percentage",
        discountValue: 50,
        startDate: "2024-11-24",
        endDate: "2024-11-30",
        productsCount: 45,
    },
    {
        id: 2,
        name: "Holiday Special",
        description: "Buy 2 Get 1 Free on Champagne",
        discountType: "BOGO",
        discountValue: 0,
        startDate: "2024-12-15",
        endDate: "2024-12-31",
        productsCount: 23,
    },
    {
        id: 3,
        name: "New Year Celebration",
description: "100 VND off on premium wines",
        discountType: "Fixed Amount",
        discountValue: 100,
        startDate: "2024-12-28",
        endDate: "2025-01-05",
        productsCount: 18,
    },
    {
        id: 4,
        name: "Summer Wine Festival",
        description: "30% off all white wines",
        discountType: "Percentage",
        discountValue: 30,
        startDate: "2024-11-01",
        endDate: "2024-11-18",
        productsCount: 67,
    },
    {
        id: 5,
        name: "Clearance Sale",
        description: "40% off on 2023 vintage",
        discountType: "Percentage",
        discountValue: 40,
        startDate: "2024-10-01",
        endDate: "2024-10-31",
        productsCount: 34,
    },
];
const getStatusColor = (status: string) => {
    switch (status) {
        case "Active":
            return "bg-green-100 text-green-800";
        case "Scheduled":
            return "bg-blue-100 text-blue-800";
        case "Expired":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getDiscountBadgeColor = (type: string) => {
    switch (type) {
        case "Percentage":
            return "bg-purple-100 text-purple-800";
        case "Fixed Amount":
            return "bg-amber-100 text-amber-800";
        case "BOGO":
            return "bg-pink-100 text-pink-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};
export { promotions, getStatusColor, getDiscountBadgeColor };