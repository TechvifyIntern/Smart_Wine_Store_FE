"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// --- MOCK DATA ---
import { wineCategories, whiskyCategories } from "@/data/shop";
import { formatCurrency } from "@/lib/utils";

const origins = [
  { id: "france", label: "France" },
  { id: "italy", label: "Italy" },
  { id: "chile", label: "Chile" },
  { id: "scotland", label: "Scotland" },
  { id: "usa", label: "USA" },
  { id: "vietnam", label: "Vietnam" },
];

interface SidebarFiltersProps {
  category?: string;
}

const SidebarFilters = ({ category }: SidebarFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. STATE: Quản lý đóng mở các mục (Category, Origin, ABV, Price)
  const [openSections, setOpenSections] = useState({
    category: true,
    origin: true,
    abv: true,
    price: true,
  });

  // 2. STATE LOCAL: Để slider mượt mà khi kéo (Price & ABV)
  const [priceRange, setPriceRange] = useState([0, 10000000]); // 0 - 10 triệu
  const [abvRange, setAbvRange] = useState([0, 60]); // 0% - 60%

  // 3. EFFECT: Đồng bộ URL xuống State khi load trang hoặc URL đổi
  useEffect(() => {
    // Sync Price
    const minP = Number(searchParams.get("minPrice")) || 0;
    const maxP = Number(searchParams.get("maxPrice")) || 10000000;
    setPriceRange([minP, maxP]);

    // Sync ABV
    const minA = Number(searchParams.get("minAbv")) || 0;
    const maxA = Number(searchParams.get("maxAbv")) || 60;
    setAbvRange([minA, maxA]);
  }, [searchParams]);

  // Toggle Accordion
  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 4. HANDLERS: Update URL
  const updateParam = (
    key: string,
    value: string | null,
    isMultiple = false
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (value === null) {
      current.delete(key);
    } else if (isMultiple) {
      const existing = current.get(key)?.split(",") || [];
      let newValues;
      if (existing.includes(value)) {
        newValues = existing.filter((v) => v !== value);
      } else {
        newValues = [...existing, value];
      }

      if (newValues.length > 0) {
        current.set(key, newValues.join(","));
      } else {
        current.delete(key);
      }
    } else {
      current.set(key, value);
    }

    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  // Commit Slider: Chỉ gọi khi thả chuột ra
  const handlePriceCommit = (value: number[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("minPrice", value[0].toString());
    current.set("maxPrice", value[1].toString());
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleAbvCommit = (value: number[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("minAbv", value[0].toString());
    current.set("maxAbv", value[1].toString());
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const isChecked = (key: string, value: string) => {
    const params = searchParams.get(key)?.split(",") || [];
    return params.includes(value);
  };

  const displayCategories =
    category === "Wine"
      ? wineCategories
      : category === "Whisky"
        ? whiskyCategories
        : [];

  // Helper render Header
  const renderHeader = (title: string, key: keyof typeof openSections) => (
    <h3
      className="font-bold mb-3 text-foreground flex justify-between items-center cursor-pointer select-none"
      onClick={() => toggleSection(key)}
    >
      <span>{title}</span>
      <ChevronDown
        size={16}
        className={`transform transition-transform duration-200 ${
          openSections[key] ? "rotate-180" : ""
        }`}
      />
    </h3>
  );

  return (
    <aside className="w-64 p-5 border-r border-border h-full overflow-y-auto">
      {/* Header & Reset Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        {searchParams.toString().length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-red-500 hover:text-red-600 px-2"
            onClick={() => router.push(pathname)}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* 1. CATEGORY */}
      {displayCategories.length > 0 && (
        <div className="mb-6 pb-6 border-b border-border/50">
          {renderHeader("Categories", "category")}
          {openSections.category && (
            <ul className="space-y-1">
              {displayCategories.map((cat) => (
                <li
                  key={cat.id}
                  className={`flex justify-between cursor-pointer p-2 rounded transition-colors text-sm ${
                    searchParams.get("subcategory") === cat.name
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                  onClick={() =>
                    updateParam(
                      "subcategory",
                      cat.name === searchParams.get("subcategory")
                        ? null
                        : cat.name
                    )
                  }
                >
                  <span>{cat.name}</span>
                  {cat.count && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 2. ORIGIN */}
      <div className="mb-6 pb-6 border-b border-border/50">
        {renderHeader("Origin / Region", "origin")}
        {openSections.origin && (
          <ul className="space-y-3">
            {origins.map((origin) => (
              <li key={origin.id} className="flex items-center space-x-2">
                <Checkbox
                  className="dark:border-white/20"
                  id={`origin-${origin.id}`}
                  checked={isChecked("origin", origin.id)}
                  onCheckedChange={() => updateParam("origin", origin.id, true)}
                />
                <label
                  htmlFor={`origin-${origin.id}`}
                  className="text-sm font-medium leading-none cursor-pointer flex-1 flex justify-between"
                >
                  <span>{origin.label}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. ABV (Alcohol %) */}
      <div className="mb-6 pb-6 border-b border-border/50">
        {renderHeader("Alcohol % (ABV)", "abv")}
        {openSections.abv && (
          <div className="px-1 pt-2">
            <Slider
              value={abvRange}
              onValueChange={setAbvRange}
              onValueCommit={handleAbvCommit}
              min={0}
              max={60}
              step={0.5}
              className="w-full mb-4"
            />
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>{abvRange[0]}%</span>
              <span>{abvRange[1]}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. PRICE (MONEY)*/}
      <div className="mb-6">
        {renderHeader("Price Range", "price")}
        {openSections.price && (
          <div className="px-1 pt-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={handlePriceCommit}
              min={0}
              max={10000000} // Max 10 triệu, tuỳ chỉnh theo data
              step={50000} // Bước nhảy 50k
              className="w-full mb-4"
            />
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarFilters;
