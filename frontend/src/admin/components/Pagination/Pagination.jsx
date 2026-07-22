import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalProducts,
  productsPerPage,
  label = "products",
}) {
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 md:flex-row">

      {/* Left */}
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="mx-1 font-semibold text-gray-900">
          {totalProducts === 0
            ? 0
            : (currentPage - 1) * productsPerPage + 1}
        </span>
        to
        <span className="mx-1 font-semibold text-gray-900">
          {Math.min(
            currentPage * productsPerPage,
            totalProducts
          )}
        </span>
        of
        <span className="mx-1 font-semibold text-gray-900">
          {totalProducts}
        </span>
        {label}
      </p>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((prev) => prev - 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaChevronLeft size={14} />
        </button>

        {/* Pages */}
        {Array.from(
          { length: totalPages },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() =>
                setCurrentPage(index + 1)
              }
              className={`h-10 w-10 rounded-xl font-semibold transition ${
                currentPage === index + 1
                  ? "bg-[#C9A227] text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage((prev) => prev + 1)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaChevronRight size={14} />
        </button>

      </div>
    </div>
  );
}

export default Pagination;