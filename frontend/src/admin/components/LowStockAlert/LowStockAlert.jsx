import { FaExclamationTriangle } from "react-icons/fa";

function LowStockAlert({
  inventory = [],
  onViewAll,
  isViewingAllLowStock,
}) {
  // Total low stock count for header & view all logic
  const totalLowStock = inventory.filter(
    (item) => item.stock <= item.reorder_level
  ).length;

  // Filter, sort by criticality (out of stock first), and limit to top 5
  const lowStockItems = inventory
    .filter((item) => item.stock <= item.reorder_level)
    .sort((a, b) => a.available - b.available)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
          <FaExclamationTriangle
            size={22}
            className="text-red-600"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Low Stock Alerts ({totalLowStock})
          </h2>
          <p className="text-sm text-gray-500">
             Showing {Math.min(totalLowStock, 5)} of {totalLowStock} products that need restocking
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {lowStockItems.length === 0 ? (
          <div className="rounded-xl bg-green-50 p-6 text-center">
            <h3 className="font-semibold text-green-700">
              🎉 All products are sufficiently stocked.
            </h3>
          </div>
        ) : (
          lowStockItems.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.image_url
                      ? `http://localhost:3000${item.image_url}`
                      : "/placeholder-product.png"
                  }
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "/placeholder-product.png";
                  }}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category : {item.category_name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    item.available === 0
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {item.available} in stock
                </p>
                <p className="text-xs text-gray-500">
                  Reorder at {item.reorder_level}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {totalLowStock > 5 && !isViewingAllLowStock && (
        <div className="mt-5 text-center">
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-amber-600 transition hover:text-amber-700"
          >
            View All {totalLowStock} Low Stock Products →
          </button>
        </div>
      )}
    </div>
  );
}

export default LowStockAlert;