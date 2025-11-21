export default function PaginationContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm px-6 py-4  border-[#F2F2F2] dark:border-slate-800/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {children}
      </div>
    </div>
  );
}
