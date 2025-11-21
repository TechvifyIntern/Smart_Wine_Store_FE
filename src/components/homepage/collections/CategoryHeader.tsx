interface CategoryHeaderProps {
    categoryName: string;
}

export function CategoryHeader({ categoryName }: CategoryHeaderProps) {
    return (
        <div className="relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                    src="/title_icon.svg"
                    alt=""
                    className="w-16 h-16 sm:w-25 sm:h-25 md:w-36 md:h-36 object-contain opacity-30 "
                    aria-hidden="true"
                />
            </div>
            {/* Header Content */}
            <div className="relative z-10 text-center py-4">
                <p className="text-xl tracking-widest text-primary uppercase mb-1">
                    {categoryName}
                </p>
                {/* Decorative line */}
                <div className="flex items-center justify-center gap-3 my-2">
                    <span className="h-px w-12 bg-primary/40" />
                    <span className="text-primary text-xs">✦</span>
                    <span className="h-px w-12 bg-primary/40" />
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl">Featured Products</h2>
            </div>
        </div>
    );
}