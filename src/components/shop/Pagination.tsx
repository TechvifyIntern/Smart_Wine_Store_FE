import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ShopPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Pagination className="my-4 sm:my-6 hover:cursor-pointer">
      <PaginationContent className="gap-1 sm:gap-2">
        <PaginationItem>
          <PaginationPrevious
            // href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePrev();
            }}
            className={`text-xs sm:text-sm ${
              currentPage === 1 ? "opacity-50 pointer-events-none" : ""
            }`}
            /* The component doesn't expose disable prop, but we can style */
          />
        </PaginationItem>

        {getVisiblePages().map((page, index) =>
          typeof page === "string" ? (
            <PaginationItem key={index} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                // href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(page);
                }}
                className={`text-xs sm:text-sm h-8 w-8 sm:h-10 sm:w-10 ${
                  page === currentPage ? "border-primary border-2" : ""
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            // href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className={`text-xs sm:text-sm ${
              currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ShopPagination;
