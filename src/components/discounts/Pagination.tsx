import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (items: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: PaginationProps) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    if (totalItems === 0) {
        return null;
    }

    return (
        <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left side: Rows per page selector and summary text */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {onItemsPerPageChange && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="rows-per-page" className="text-sm text-gray-600 whitespace-nowrap">
                                Rows per page:
                            </label>
                            <select
                                id="rows-per-page"
                                value={itemsPerPage}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={15}>20</option>
                                <option value={20}>30</option>
                            </select>
                        </div>
                    )}
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to{" "}
                        <span className="font-medium text-gray-900">{endIndex}</span> of{" "}
                        <span className="font-medium text-gray-900">{totalItems}</span> items
                    </div>
                </div>

                {/* Right side: Page navigation buttons */}
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                let pageNumber;

                                // Smart pagination: show first, last, current, and nearby pages
                                if (totalPages <= 7) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 4) {
                                    pageNumber = i < 5 ? i + 1 : (i === 5 ? "..." : totalPages);
                                } else if (currentPage >= totalPages - 3) {
                                    pageNumber = i < 2 ? (i === 0 ? 1 : "...") : totalPages - (6 - i);
                                } else {
                                    if (i === 0) pageNumber = 1;
                                    else if (i === 1) pageNumber = "...";
                                    else if (i === 5) pageNumber = "...";
                                    else if (i === 6) pageNumber = totalPages;
                                    else pageNumber = currentPage + i - 3;
                                }

                                if (pageNumber === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${i}`}
                                            className="flex items-center justify-center w-9 h-9 text-gray-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber as number)}
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg font-medium transition-colors ${currentPage === pageNumber
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        aria-label={`Page ${pageNumber}`}
                                        aria-current={currentPage === pageNumber ? "page" : undefined}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
