import { FaEye, FaSyncAlt, FaFileInvoice } from "react-icons/fa";

// Status Text Mapping
const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

// Status Color Mapping
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-700";
    case "confirmed":
      return "bg-yellow-100 text-yellow-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

function OrderRow({
  order,
  onView,
  onStatus,
  onInvoice,
}) {
  return (
    <tr className="border-b transition hover:bg-gray-50">

      {/* Order ID */}
      <td className="px-6 py-4 font-semibold text-[#C9A227]">
        #{order.order_id}
      </td>

      {/* Customer */}
      <td className="px-6 py-4">
        <h3 className="font-semibold text-gray-900">
          {order.customer_name}
        </h3>

        <p className="text-xs text-gray-500">
          {order.customer_email}
        </p>
      </td>

      {/* Amount */}
      <td className="px-6 py-4 font-semibold">
        ₹{Number(order.total_amount).toLocaleString("en-IN")}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
        >
          {formatStatus(order.status)}
        </span>
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-gray-600">
        {new Date(order.created_at).toLocaleDateString("en-IN")}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-3">

          <button
            onClick={() => onView(order)}
            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
          >
            <FaEye />
          </button>

          <button
            onClick={() => onStatus(order)}
            className="rounded-lg bg-[#FFF8E5] p-2 text-[#C9A227] hover:bg-[#F5E8B2]"
          >
            <FaSyncAlt />
          </button>

          <button
            onClick={() => onInvoice(order)}
            className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
            title="Invoice"
          >
            <FaFileInvoice />
          </button>

        </div>
      </td>

    </tr>
  );
}

export default OrderRow;