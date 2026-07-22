import { FaTimes } from "react-icons/fa";

function StockDetailsModal({ open, onClose, item }) {
  if (!open || !item) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold">Inventory Details</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-8 p-8 lg:grid-cols-3">
          {/* Left Card */}
          <div className="rounded-2xl border p-6">
            <img
              src={item.image_url || "/no-image.png"}
              alt={item.title}
              onError={(e) => {
                e.target.src = "/no-image.png";
              }}
              className="mx-auto h-60 w-60 rounded-2xl object-cover"
            />

            <h3 className="mt-6 text-center text-2xl font-bold">
              {item.title}
            </h3>

            <div className="mt-5 flex justify-center">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stock Summary */}
            <div className="rounded-2xl border p-6">
              <h3 className="mb-5 text-xl font-semibold">Stock Summary</h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Total Stock</p>
                  <h4 className="text-xl font-bold">{item.stock ?? 0}</h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Reserved</p>
                  <h4 className="text-xl font-bold">{item.reserved ?? 0}</h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Available</p>
                  <h4 className="text-xl font-bold">{item.available ?? 0}</h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Reorder Level</p>
                  <h4 className="text-xl font-bold">{item.reorder_level ?? 0}</h4>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="rounded-2xl border p-6">
              <h3 className="mb-5 text-xl font-semibold">Product Details</h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <h4 className="text-lg font-semibold">
                    {item.category_name || "-"}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <h4 className="text-lg font-semibold">
                    {item.status || "-"}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Product ID</p>
                  <h4 className="text-lg font-semibold">
                    {item.product_id ? `#${item.product_id}` : "-"}
                  </h4>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Available Stock</p>
                  <h4 className="text-lg font-semibold">
                    {item.available ?? 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b08d1f]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockDetailsModal;