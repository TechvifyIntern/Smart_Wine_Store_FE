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
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

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
    <aside className="w-64 p-5 border-r border-border ">
      <div className="mb-6">
        <h3
          className="font-bold mb-2 text-foreground flex justify-between items-center cursor-pointer"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <span>Shop By Category</span>
          <ChevronDown
            size={14}
            className={`transform transition-transform ${
              isCategoryOpen ? "rotate-180" : ""
            }`}
          />
        </h3>
        {isCategoryOpen && (
          <ul className="space-y-2">
            {displayCategories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between cursor-pointer hover:bg-muted p-2 rounded text-foreground"
              >
                <span>{cat.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h4
          className="font-semibold mb-2 text-foreground flex justify-between items-center cursor-pointer"
          onClick={() => setIsSizeOpen(!isSizeOpen)}
        >
          <span>Size</span>
          <ChevronDown
            size={14}
            className={`transform transition-transform ${
              isSizeOpen ? "rotate-180" : ""
            }`}
          />
        </h4>
        {isSizeOpen && (
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
        )}
      </div>

      <div className="mb-6">
        <h4
          className="font-semibold mb-2 text-foreground flex justify-between items-center cursor-pointer"
          onClick={() => setIsColorOpen(!isColorOpen)}
        >
          <span>Color</span>
          <ChevronDown
            size={14}
            className={`transform transition-transform ${
              isColorOpen ? "rotate-180" : ""
            }`}
          />
        </h4>
        {isColorOpen && (
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
        )}
      </div>

      <div className="mb-6">
        <h4
          className="font-semibold mb-2 text-foreground flex justify-between items-center cursor-pointer"
          onClick={() => setIsBrandOpen(!isBrandOpen)}
        >
          <span>Brand</span>
          <ChevronDown
            size={14}
            className={`transform transition-transform ${
              isBrandOpen ? "rotate-180" : ""
            }`}
          />
        </h4>
        {isBrandOpen && (
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
        )}
      </div>

      <div className="mb-6">
        <h4
          className="font-semibold mb-2 text-foreground flex justify-between items-center cursor-pointer"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <span>Price</span>
          <ChevronDown
            size={14}
            className={`transform transition-transform ${
              isPriceOpen ? "rotate-180" : ""
            }`}
          />
        </h4>
        {isPriceOpen && (
          <>
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
          </>
        )}
      </div>
    </aside>
  );
};

export default SidebarFilters;
