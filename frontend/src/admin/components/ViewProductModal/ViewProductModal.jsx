import { FaTimes } from "react-icons/fa";

function ViewProductModal({
  open,
  onClose,
  product,
}) {
  if (!open || !product) return null;
  const getStatus = () => {
    if (product.quantity <= 0) return "Out of Stock";
    if (product.quantity <= 10) return "Low Stock";
    return "Active";
  };

  const status = getStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Product Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View complete product information.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>

        </div>

        {/* Body */}
        <div className="grid gap-10 p-8 lg:grid-cols-2">

          {/* Left */}
          <div>

            <img
              src={product.image_url || "/no-image.png"}
              alt={product.title}
              className="h-[420px] w-full rounded-2xl border object-cover"
            />

          </div>

          {/* Right */}

          <div className="space-y-5">

            <div>

              <h2 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h2>

              <p className="mt-2 text-gray-500">
                SKU : {product.sku}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Category
                </p>

                <h3 className="mt-1 font-semibold">
                  {product.category}
                </h3>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Price
                </p>

                <h3 className="mt-1 font-semibold">
                  ₹{product.price}
                </h3>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Stock
                </p>

                <h3 className="mt-1 font-semibold">
                  {product.quantity}
                </h3>

              </div>

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    status === "Active"
                      ? "bg-green-100 text-green-700"
                      : product.status === "Low Stock"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>

              </div>

            </div>

            <div>

              <h3 className="mb-2 text-lg font-semibold">
                Description
              </h3>

              <p className="leading-7 text-gray-600">
                {product.description ||
                  "No description available."}
              </p>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b18d1e]"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default ViewProductModal;