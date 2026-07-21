import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import adminApi from "../../../services/adminApi";

function StockHistoryModal({ open, onClose, item }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && item) {
      fetchHistory();
    }
  }, [open, item]);

  const fetchHistory = async () => {
    if (!item) return;

    try {
      setLoading(true);
      const res = await adminApi.get(
        `/api/admin/inventory/${item.product_id}/history`
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stock history");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h2 className="text-2xl font-bold">Stock History</h2>
            <p className="mt-1 text-sm text-gray-500">{item.title}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#F8F6F2]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Action
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Quantity
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Supplier Note
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Updated By
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" className="py-10 text-center">
                    Loading history...
                  </td>
                </tr>
              )}

              {!loading && history.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500"
                  >
                    No stock history found.
                  </td>
                </tr>
              )}

              {!loading &&
                history.map((log) => (
                  <tr key={log.log_id} className="border-b hover:bg-gray-50">
                    {/* 1. Formatted Date */}
                    <td className="px-6 py-4">
                      {new Intl.DateTimeFormat("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(new Date(log.created_at))}
                    </td>

                    {/* 2. Action with Badge Style */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          log.action === "Stock Added"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* 3. Quantity Difference */}
                    <td
                      className={`px-6 py-4 text-center font-bold ${
                        log.new_stock > log.old_stock
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {log.new_stock > log.old_stock
                        ? `+${log.new_stock - log.old_stock}`
                        : `-${log.old_stock - log.new_stock}`}
                    </td>

                    {/* 4. Old -> New Stock Transition */}
                    <td className="px-6 py-4 text-center font-medium">
                      {log.old_stock} → {log.new_stock}
                    </td>

                    {/* 5. Plain Text Reason */}
                    <td className="px-6 py-4">
                      {log.change_reason || "-"}
                    </td>

                    {/* 6. Supplier Note */}
                    <td className="px-6 py-4 text-gray-600">
                      {log.supplier_note || "-"}
                    </td>

                    {/* 7. Updated By */}
                    <td className="px-6 py-4">
                      {log.updated_by || "Admin"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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

export default StockHistoryModal;