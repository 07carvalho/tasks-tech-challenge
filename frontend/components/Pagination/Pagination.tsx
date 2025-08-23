type PaginationProps = {
  count: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ count, currentPage, onPageChange }: PaginationProps) {
  const pageSize = 12;
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage === 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 3 + 1) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="mt-6 flex items-center space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-50 hover:bg-gray-400 cursor-pointer"
      >
        Previous
      </button>

      {pages.map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded cursor-pointer ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-3 py-1">
            {page}
          </span>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-50 hover:bg-gray-400 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
