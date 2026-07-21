import { FaTimes } from "react-icons/fa";

function StockDetailsModal({
  open,
  onClose,
  item,
}) {
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

            <h2 className="text-2xl font-bold">
              Inventory Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              SKU : -
            </p>

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

          {/* Left */}

          <div className="rounded-2xl border p-6">

            <img
              src={`http://localhost:3000${item.image_url}`}
              alt={item.title}
              className="mx-auto h-60 w-60 rounded-2xl object-cover"
            />

            <h3 className="mt-6 text-center text-2xl font-bold">
              {item.title}
            </h3>

            <p className="mt-2 text-center text-gray-500">
              {item.category_name}
            </p>

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

          {/* Right */}

          <div className="space-y-6 lg:col-span-2">

            {/* Stock Summary */}

            <div className="rounded-2xl border p-6">

              <h3 className="mb-5 text-xl font-semibold">
                Stock Summary
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <p className="text-sm text-gray-500">
                    Total Stock
                  </p>

                  <h4 className="text-xl font-bold">
                    {item.stock}
                  </h4>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Reserved
                  </p>

                  <h4 className="text-xl font-bold">
                    {item.reserved}
                  </h4>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Available
                  </p>

                  <h4 className="text-xl font-bold">
                    {item.available}
                  </h4>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Reorder Level
                  </p>

                  <h4 className="text-xl font-bold">
                    {item.reorder_level}
                  </h4>

                </div>

              </div>

            </div>

            {/* Supplier */}

            <div className="rounded-2xl border p-6">

              <h3 className="mb-5 text-xl font-semibold">
                Supplier Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <p className="text-sm text-gray-500">
                    Supplier
                  </p>

                  <h4 className="font-semibold">
                    {item.brand || "N/A"}
                  </h4>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Last Updated
                  </p>

                  <h4 className="font-semibold">
                    {new Date(item.created_at).toLocaleDateString()}
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