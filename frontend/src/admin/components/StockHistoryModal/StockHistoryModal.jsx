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
      {/* Outer Shell: Fixed Height (90vh) with Strict Overflow Prevention */}
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* 1. FIXED MODAL HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b px-8 py-5">
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

        {/* 2. ISOLATED SCROLL ENGINE (min-h-0 prevents flex child height overflow) */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full">
              {/* CLEAN FIXED TABLE HEADER (No sticky CSS hacks required) */}
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

              {/* DYNAMIC SCROLLABLE BODY ROWS ONLY */}
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
                      {/* Date */}
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

                      {/* Action Badge */}
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

                      {/* Quantity Diff */}
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

                      {/* Stock Transition */}
                      <td className="px-6 py-4 text-center font-medium">
                        {log.old_stock} → {log.new_stock}
                      </td>

                      {/* Reason */}
                      <td className="px-6 py-4">
                        {log.change_reason || "-"}
                      </td>

                      {/* Supplier Note */}
                      <td className="px-6 py-4 text-gray-600">
                        {log.supplier_note || "-"}
                      </td>

                      {/* Updated By */}
                      <td className="px-6 py-4">
                        {log.updated_by || "Admin"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. FIXED MODAL FOOTER WITH EXPLICIT SOLID BACKGROUND */}
        <div className="flex shrink-0 justify-end border-t bg-white px-8 py-5">
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