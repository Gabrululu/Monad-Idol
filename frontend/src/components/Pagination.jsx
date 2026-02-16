export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    onPageSizeChange,
    hasNextPage,
    hasPreviousPage,
}) {
    const pageSizeOptions = [10, 25, 50];

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-monad-border">
            {/* Page info */}
            <div className="text-sm text-gray-400">
                Showing <span className="font-semibold text-white">{startIndex}</span> to{' '}
                <span className="font-semibold text-white">{endIndex}</span> of{' '}
                <span className="font-semibold text-white">{totalItems}</span> projects
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="px-3 py-2 rounded-lg glass hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ←
                </button>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === page
                                    ? 'bg-monad-purple text-white'
                                    : 'glass hover:bg-white/20'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="px-3 py-2 rounded-lg glass hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    →
                </button>
            </div>

            {/* Page size selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Per page:</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="glass px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-white/20 transition-all border border-monad-border focus:outline-none focus:border-monad-purple"
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size} className="bg-monad-card-bg">
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
