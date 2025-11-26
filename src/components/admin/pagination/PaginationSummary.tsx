interface Props {
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export default function PaginationSummary({ startIndex, endIndex, totalItems }: Props) {
  return (
    <div className="text-sm text-gray-600 dark:text-slate-400">
      Showing <span className="font-medium text-gray-900 dark:text-slate-200">{startIndex + 1}</span> to{" "}
      <span className="font-medium text-gray-900 dark:text-slate-200">{endIndex}</span> of{" "}
      <span className="font-medium text-gray-900 dark:text-slate-200">{totalItems}</span> items
    </div>
  );
}
