import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

function ProductRow({ product, onView, onEdit, onDelete }) {

  // Quantity ke basis par status logic
  const getStatus = () => {
    if (product.quantity <= 0) return "Out of Stock";
    if (product.quantity <= 10) return "Low Stock";
    return "Active";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";

      case "Out of Stock":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const status = getStatus();

  return (
    <tr className="border-b transition hover:bg-gray-50">

      {/* Image */}
      <td className="px-6 py-4">
        <img
          src={product.image_url || "/no-image.png"} // Fixed: backend query field image_url
          alt={product.title}
          className="h-14 w-14 rounded-xl object-cover"
        />
      </td>

      {/* Product */}
      <td className="px-6 py-4">
        <h3 className="font-semibold text-gray-900">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500">
          {product.sku}
        </p>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        {product.category} {/* Fixed: backend query field category */}
      </td>

      {/* Price */}
      <td className="px-6 py-4 font-semibold">
        ₹{Number(product.price || 0).toLocaleString("en-IN")}
      </td>

      {/* Quantity */}
      <td className="px-6 py-4">
        {product.quantity}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}
        >
          {status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(product)}
            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
          >
            <FaEye />
          </button>

          <button
            onClick={() => onEdit(product)}
            className="rounded-lg bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(product)}
            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
          >
            <FaTrash />
          </button>

        </div>
      </td>

    </tr>
  );
}

export default ProductRow;