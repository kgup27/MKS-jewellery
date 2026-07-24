import { Link } from "react-router-dom";
import {
  FaTriangleExclamation,
  FaBoxOpen,
} from "react-icons/fa6";

function LowStock({
  products = [],
  viewAllPath = "/admin/inventory",
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Low Stock Products
          </h2>
          <p className="text-sm text-gray-500">
            Products that need restocking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaTriangleExclamation
            size={22}
            className="text-red-500"
          />

          <Link
            to={viewAllPath}
            className="rounded-lg border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-white"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Product List / Empty State */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No low stock products.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-red-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <FaBoxOpen
                    className="text-red-600"
                    size={20}
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {product.title || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Product #{product.id}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-red-600">
                  {product.quantity ?? 0}
                </p>
                <p className="text-xs text-gray-500">
                  Items Left
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LowStock;