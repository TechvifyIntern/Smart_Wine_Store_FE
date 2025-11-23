import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationButtons({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center gap-2">

      {/* Prev */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-slate-700/50 rounded-lg bg-white dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-lg font-medium transition-all ${currentPage === page
                  ? "bg-[#AD8D5E] dark:bg-[#7C653E] text-white shadow-sm"
                  : "bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/70"
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 border border-gray-300 dark:border-slate-700/50 rounded-lg bg-white dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>
  );
}
