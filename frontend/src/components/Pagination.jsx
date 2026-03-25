import { useSearchParams } from "react-router-dom";

const Pagination = ({ totalPages,products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;

  if (!products || products?.length === 0 || totalPages <= 1) return null;
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
  };

  const renderPages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      // Show limited pages like: 1 2 3 ... last
      if ( i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1) ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform
              ${
                currentPage === i
                  ? "bg-blue-600 text-white shadow-md cursor-default"
                  : "text-gray-600 hover:bg-gray-200 hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
              }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 && i > 1) ||
        (i === currentPage + 2 && i < totalPages)
      ) {
        pages.push(
          <span key={i} className="px-3 py-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`px-3 py-2 text-sm transition-colors duration-200
          ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-black font-semibold cursor-pointer"
          }`}
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      {renderPages()}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`px-3 py-2 text-sm transition-colors duration-200
          ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-black font-semibold cursor-pointer"
          }`}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;