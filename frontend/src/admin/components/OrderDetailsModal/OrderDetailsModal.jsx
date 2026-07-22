import { FaTimes } from "react-icons/fa";

// 1. Helper functions for Status mapping
const formatOrderStatus = (status) => {
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

const formatPaymentStatus = (status) => {
  switch (status) {
    case "completed":
      return "Paid";
    case "pending":
      return "Pending";
    case "refunded":
      return "Refunded";
    case "failed":
      return "Failed";
    default:
      return status;
  }
};

function OrderDetailsModal({ open, onClose, order }) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Order ID : #{order.order_id}
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
        <div className="space-y-6 p-8">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Customer Name */}
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <h4 className="font-semibold">{order.customer_name}</h4>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <h4 className="font-semibold">{order.customer_email}</h4>
            </div>

            {/* 4. Phone Section */}
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <h4 className="font-semibold">
                {order.customer_phone || "N/A"}
              </h4>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <h4 className="font-semibold text-[#C9A227]">
                ₹{Number(order.total_amount).toLocaleString("en-IN")}
              </h4>
            </div>

            {/* 2. Order Status (Updated with Helper) */}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <h4 className="font-semibold">
                {formatOrderStatus(order.status)}
              </h4>
            </div>

            {/* 3. Payment Status Section */}
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <h4 className="font-semibold">
                {formatPaymentStatus(order.payment_status)}
              </h4>
            </div>

            {/* Order Date */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Order Date</p>
              <h4 className="font-semibold">
                {new Date(order.created_at).toLocaleDateString("en-IN")}
              </h4>
            </div>

            {/* 5. Shipping Address Section */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Shipping Address</p>
              <h4 className="font-semibold leading-7">
                {order.shipping_address_line1}
                {order.shipping_address_line2 && (
                  <>
                    <br />
                    {order.shipping_address_line2}
                  </>
                )}
                <br />
                {order.shipping_city}, {order.shipping_state}
                <br />
                {order.shipping_pincode}
                <br />
                {order.shipping_country}
              </h4>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white hover:bg-[#b08d1f]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderDetailsModal;