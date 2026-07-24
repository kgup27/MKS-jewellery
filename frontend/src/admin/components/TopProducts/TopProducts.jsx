import { Link } from "react-router-dom";
import { FaGem, FaArrowTrendUp } from "react-icons/fa6";

function TopProducts({ products = [], viewAllPath = "/admin/products" }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Top Selling Products
          </h2>
          <p className="text-sm text-gray-500">
            Best performing jewellery
          </p>
        </div>

        <Link
          to={viewAllPath}
          className="rounded-lg border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-white"
        >
          View All
        </Link>
      </div>

      {/* Product List */}
      <div className="space-y-5">
        {!products || products.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No top selling products found.
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={product.id ?? index}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A227]/10">
                  <FaGem className="text-[#C9A227]" size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {product.title || "Untitled Product"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.category || "General"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {product.total_sales ?? 0} Sold
                </p>

                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <FaArrowTrendUp className="text-green-500" size={12} />
                  <span className="text-sm font-medium text-green-600">
                    Trending
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TopProducts;