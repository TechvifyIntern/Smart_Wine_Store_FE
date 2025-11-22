export interface ProductCategory {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    ParentCategoryID?: number | null;
    ParentCategoryName?: string | null;
    ProductCount: number;
}

const productCategories: ProductCategory[] = [
    {
        CategoryID: 1,
        CategoryName: "Red Wine",
        Description: "Full-bodied red wines from around the world",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 45,
    },
    {
        CategoryID: 2,
        CategoryName: "White Wine",
        Description: "Crisp and refreshing white wine varieties",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 38,
    },
    {
        CategoryID: 3,
        CategoryName: "Rosé Wine",
        Description: "Light and fruity rosé wines perfect for any occasion",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 22,
    },
    {
        CategoryID: 4,
        CategoryName: "Sparkling Wine",
        Description: "Champagnes and sparkling wines for celebrations",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 18,
    },
    {
        CategoryID: 5,
        CategoryName: "Cabernet Sauvignon",
        Description: "Bold and complex Cabernet Sauvignon wines",
        ParentCategoryID: 1,
        ParentCategoryName: "Red Wine",
        ProductCount: 15,
    },
    {
        CategoryID: 6,
        CategoryName: "Pinot Noir",
        Description: "Elegant and light-bodied Pinot Noir",
        ParentCategoryID: 1,
        ParentCategoryName: "Red Wine",
        ProductCount: 12,
    },
    {
        CategoryID: 7,
        CategoryName: "Merlot",
        Description: "Smooth and fruity Merlot wines",
        ParentCategoryID: 1,
        ParentCategoryName: "Red Wine",
        ProductCount: 10,
    },
    {
        CategoryID: 8,
        CategoryName: "Chardonnay",
        Description: "Rich and buttery Chardonnay varieties",
        ParentCategoryID: 2,
        ParentCategoryName: "White Wine",
        ProductCount: 14,
    },
    {
        CategoryID: 9,
        CategoryName: "Sauvignon Blanc",
        Description: "Crisp and zesty Sauvignon Blanc",
        ParentCategoryID: 2,
        ParentCategoryName: "White Wine",
        ProductCount: 11,
    },
    {
        CategoryID: 10,
        CategoryName: "Riesling",
        Description: "Sweet and aromatic Riesling wines",
        ParentCategoryID: 2,
        ParentCategoryName: "White Wine",
        ProductCount: 8,
    },
    {
        CategoryID: 11,
        CategoryName: "Champagne",
        Description: "Authentic French Champagne",
        ParentCategoryID: 4,
        ParentCategoryName: "Sparkling Wine",
        ProductCount: 10,
    },
    {
        CategoryID: 12,
        CategoryName: "Prosecco",
        Description: "Italian Prosecco and sparkling wines",
        ParentCategoryID: 4,
        ParentCategoryName: "Sparkling Wine",
        ProductCount: 8,
    },
    {
        CategoryID: 13,
        CategoryName: "Dessert Wine",
        Description: "Sweet dessert wines and late harvest varieties",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 12,
    },
    {
        CategoryID: 14,
        CategoryName: "Organic Wine",
        Description: "Certified organic and biodynamic wines",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 20,
    },
    {
        CategoryID: 15,
        CategoryName: "Premium Collection",
        Description: "High-end premium wines for connoisseurs",
        ParentCategoryID: null,
        ParentCategoryName: null,
        ProductCount: 25,
    },
];

export default productCategories;
