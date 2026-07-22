import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function UpdateStatusModal({ open, onClose, order, onSave }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      const initialStatus = order.status === "Processing" ? "confirmed" : order.status?.toLowerCase();
      setStatus(initialStatus || "pending");
    }
  }, [order]);

  if (!open || !order) return null;

  const handleSubmit = () => {
    onSave({
      ...order,
      status, 
    });
  };

  // Safe check for ID: order_id ya id dono me se jo bhi available ho
  const currentOrderId = order.order_id || order.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">Update Order Status</h2>
            <p className="mt-1 text-sm text-gray-500">Order #{currentOrderId}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold">Customer</label>
            <input
              type="text"
              value={order.customer_name || ""}
              readOnly
              className="w-full rounded-xl border bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="text"
              value={order.customer_email || ""}
              readOnly
              className="w-full rounded-xl border bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Phone
            </label>

            <input
              type="text"
              value={order.customer_phone || ""}
              readOnly
              className="w-full rounded-xl border bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-5">
          <button onClick={onClose} className="rounded-xl border px-5 py-3 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white hover:bg-[#b08d1f]"
          >
            Update Status
          </button>
        </div>

      </div>
    </div>
  );
}

export default UpdateStatusModal;