import { Search, X } from "lucide-react";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
}: SearchBarProps) {
    const handleClear = () => {
        onSearchChange("");
    };

    return (
        <div className="flex-1 max-w-2xl">
            <label htmlFor="search-input" className="sr-only">
                Search
            </label>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    id="search-input"
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    aria-label="Search events"
                    className="w-full h-12 pl-12 pr-12 dark:bg-slate-800/50 border dark:border-slate-700/50 rounded-full dark:text-slate-300 dark:placeholder-slate-500 focus:outline-none"
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
    );
}
