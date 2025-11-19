import { wineCategories, whiskyCategories } from "@/data/shop";
import React from "react";

interface SubcategoriesProps {
  category?: string;
}

const Subcategories = ({ category }: SubcategoriesProps) => {
  const getSubcategories = () => {
    if (category === "wine") {
      return wineCategories;
    } else if (category === "whisky") {
      return whiskyCategories;
    }
    // Default to wine subcategories if no category
    return wineCategories;
  };

  const subcategories = getSubcategories();

  return (
    <section className="flex space-x-4 my-6">
      {subcategories.map((cat) => (
        <div
          key={cat.id}
          className="border rounded p-4 w-36 h-32 flex flex-col justify-center items-center text-center"
        >
          <div className="mb-2 text-gray-400 italic">No image available</div>
          <h5 className="font-semibold">{cat.name}</h5>
        </div>
      ))}
    </section>
  );
};

export default Subcategories;
