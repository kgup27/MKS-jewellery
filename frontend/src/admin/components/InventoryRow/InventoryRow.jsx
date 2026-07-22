import {
  FaEye,
  FaEdit,
  FaHistory,
} from "react-icons/fa";

function InventoryRow({
  item,
  onView,
  onUpdate,
  onHistory,
}) {
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
  
  console.log(item);
  console.log("IMAGE URL:", item.image_url);
  
  return (
    <tr className="border-b transition hover:bg-gray-50">

      {/* Product */}

      <td className="px-6 py-4">

        <div className="flex items-center gap-4">
          
          <img
            src={item.image_url || "/no-image.png"}
            alt={item.title}
            className="h-14 w-14 rounded-xl object-cover border"
          />

          <div>

            <h3 className="font-semibold text-gray-900">
              {item.title}
            </h3>


          </div>

        </div>

      </td>

      

      {/* Category */}

      <td className="px-6 py-4">
        {item.category_name}
      </td>

      {/* Stock */}

      <td className="px-6 py-4 text-center font-semibold">
        {item.stock}
      </td>

      {/* Reserved */}

      <td className="px-6 py-4 text-center">
        {item.reserved}
      </td>

      {/* Available */}

      <td className="px-6 py-4 text-center font-semibold">
        {item.available}
      </td>

      {/* Reorder */}

      <td className="px-6 py-4 text-center">
        {item.reorder_level}
      </td>

      {/* Status */}

      <td className="px-6 py-4 text-center">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>

      </td>

      {/* Actions */}

      <td className="px-6 py-4">

        <div className="flex justify-center gap-3">

          {/* View */}

          <button
            onClick={() => onView(item)}
            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
          >
            <FaEye />
          </button>

          {/* Update */}

          <button
            onClick={() => onUpdate(item)}
            className="rounded-lg bg-yellow-50 p-2 text-yellow-600 transition hover:bg-yellow-100"
          >
            <FaEdit />
          </button>

          {/* History */}

          <button
            onClick={() => onHistory(item)}
            className="rounded-lg bg-purple-50 p-2 text-purple-600 transition hover:bg-purple-100"
          >
            <FaHistory />
          </button>

        </div>

      </td>

    </tr>
  );
}

export default InventoryRow;