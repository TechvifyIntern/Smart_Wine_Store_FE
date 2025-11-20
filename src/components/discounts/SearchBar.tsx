import { Search, Filter, Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onCreateClick?: () => void;
    placeholder?: string;
    createButtonText?: string;
}

export default function SearchBar({
    searchTerm,
    onSearchChange,
    onCreateClick,
    placeholder = "Search...",
    createButtonText = "Create",
}: SearchBarProps) {
    const handleClear = () => {
        onSearchChange("");
    };

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1 max-w-2xl">
                <label htmlFor="search-input" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    <Input
                        id="search-input"
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        aria-label="Search events"
                        className="w-full h-10 pl-10 text-sm pr-10 border-0 rounded-[100px] bg-white focus:bg-white focus:ring-2"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors"
                            aria-label="Clear search"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                {onCreateClick && (
                    <Button
                        onClick={onCreateClick}
                        className={`flex items-center justify-center h-10 px-4 py-2 text-white font-medium rounded-lg rounded-[100px] `}
                        type="button"
                        aria-label={`Create new ${createButtonText.toLowerCase()}`}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {createButtonText}
                    </Button>
                )}
            </div>
        </div>
    );
}
