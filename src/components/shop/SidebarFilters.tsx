import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  brands,
  wineCategories,
  whiskyCategories,
  colors,
  sizes,
} from "@/data/shop";
import { Slider } from "@/components/ui/slider";

interface SidebarFiltersProps {
  category?: string;
}

const SidebarFilters = ({ category }: SidebarFiltersProps) => {
  const [priceRange, setPriceRange] = useState({ min: 23, max: 126 });

  const getDisplayCategories = () => {
    if (category === "wine") {
      return wineCategories;
    } else if (category === "whisky") {
      return whiskyCategories;
    }
    // Default to wine categories if no specific category
    return wineCategories;
  };

  const displayCategories = getDisplayCategories();

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange({ min: values[0], max: values[1] });
  };

  return (
    <aside className="w-64 p-5 border-r border-border bg-card">
      <div className="mb-6">
        <h3 className="font-bold mb-2 text-foreground">Shop By Category</h3>
        <ul className="space-y-2">
          {displayCategories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between cursor-pointer hover:bg-muted p-2 rounded text-foreground"
            >
              <span>{cat.name}</span> <ChevronDown size={14} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-foreground">Size</h4>
        <ul>
          {sizes.map((size) => (
            <li key={size.id} className="text-foreground">
              <label className="inline-flex items-center space-x-2 hover:bg-muted p-2 rounded cursor-pointer">
                <input type="checkbox" className="accent-primary" />
                <span>
                  {size.label} ({size.count})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-foreground">Color</h4>
        <ul>
          {colors.map((color) => (
            <li key={color.id} className="text-foreground">
              <label className="inline-flex items-center space-x-2 hover:bg-muted p-2 rounded cursor-pointer">
                <input type="checkbox" className="accent-primary" />
                <span>
                  {color.label} ({color.count})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-foreground">Brand</h4>
        <ul>
          {brands.map((brand) => (
            <li key={brand.id} className="text-foreground">
              <label className="inline-flex items-center space-x-2 hover:bg-muted p-2 rounded cursor-pointer">
                <input type="checkbox" className="accent-primary" />
                <span>
                  {brand.name} ({brand.count})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-foreground">Price</h4>
        <Slider
          value={[priceRange.min, priceRange.max]}
          onValueChange={handlePriceRangeChange}
          min={23}
          max={126}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-4">
          <span className="px-2 py-1 rounded">${priceRange.min}.00</span>
          <span className="px-2 py-1 rounded">${priceRange.max}.00</span>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
