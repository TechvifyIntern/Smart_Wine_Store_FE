interface Props {
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export default function RowsPerPageSelector({ itemsPerPage, onItemsPerPageChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 dark:text-slate-400 whitespace-nowrap">
        Rows per page:
      </label>

      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="px-3 py-1.5 border border-gray-300 dark:border-slate-700/50 rounded-lg bg-white dark:bg-slate-800/50 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#ad8d5e] transition-colors cursor-pointer"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
    </div>
  );
}
