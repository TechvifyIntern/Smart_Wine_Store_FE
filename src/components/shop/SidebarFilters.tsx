"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const origins = [
  { id: "Mỹ", label: "Mỹ" },
  { id: "Argentina", label: "Argentina" },
  { id: "New Zealand", label: "New Zealand" },
  { id: "TBN", label: "TBN" },
  { id: "Ý", label: "Ý" },
  { id: "Hungary", label: "Hungary" },
  { id: "Chile", label: "Chile" },
  { id: "Pháp", label: "Pháp" },
  { id: "Bồ Đào Nha", label: "Bồ Đào Nha" },
  { id: "Scotland", label: "Scotland" },
  { id: "Tây Ban Nha", label: "Tây Ban Nha" },
  { id: "Đức", label: "Đức" },
  { id: "Úc", label: "Úc" },
  { id: "Nam Phi", label: "Nam Phi" },
];

const SidebarFilters = () => {
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
  const [priceRange, setPriceRange] = useState([0, 260000000]); // 0 - 260 triệu
  const [abvRange, setAbvRange] = useState([0, 65]); // 0% - 60%

  // 3. EFFECT: Đồng bộ URL xuống State khi load trang hoặc URL đổi
  useEffect(() => {
    // Sync Price
    const minP = Number(searchParams.get("minPrice")) || 0;
    const maxP = Number(searchParams.get("maxPrice")) || 260000000;
    setPriceRange([minP, maxP]);

    // Sync ABV
    const minA = Number(searchParams.get("minAbv")) || 0;
    const maxA = Number(searchParams.get("maxAbv")) || 65;
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
    <aside className="w-full md:w-64 p-4 md:p-5 border-r-0 md:border-r border-border h-auto md:h-full overflow-y-auto">
      {/* Header & Reset Button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">Filters</h2>
        {searchParams.toString().length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 sm:h-8 text-red-500 hover:text-red-600 px-2"
            onClick={() => router.push(pathname)}
          >
            Clear all
          </Button>
        )}
      </div>
      {/* 2. ORIGIN */}
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
        {renderHeader("Origin / Region", "origin")}
        {openSections.origin && (
          <ul className="space-y-2 sm:space-y-3">
            {origins.map((origin) => (
              <li key={origin.id} className="flex items-center space-x-2">
                <Checkbox
                  className="dark:border-white/20"
                  id={`origin-${origin.id}`}
                  checked={isChecked("origin", origin.id)}
                  onCheckedChange={() => updateParam("origin", origin.id)}
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
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
        {renderHeader("Alcohol % (ABV)", "abv")}
        {openSections.abv && (
          <div className="px-1 pt-2">
            <Slider
              value={abvRange}
              onValueChange={setAbvRange}
              onValueCommit={handleAbvCommit}
              min={0}
              max={65}
              step={0.5}
              className="w-full mb-3 sm:mb-4"
            />
            <div className="flex justify-between text-[10px] sm:text-xs font-medium text-muted-foreground">
              <span>{abvRange[0]}%</span>
              <span>{abvRange[1]}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. PRICE (MONEY)*/}
      <div className="mb-4 sm:mb-6">
        {renderHeader("Price Range", "price")}
        {openSections.price && (
          <div className="px-1 pt-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={handlePriceCommit}
              min={0}
              max={260000000} // Max 260 triệu, tuỳ chỉnh theo data
              step={500000} // Bước nhảy 500k
              className="w-full mb-3 sm:mb-4"
            />
            <div className="flex justify-between text-[10px] sm:text-xs font-medium text-muted-foreground">
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
