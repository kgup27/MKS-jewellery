import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

function UpdateStockModal({
  open,
  onClose,
  item,
  onSave,
}) {
  const [formData, setFormData] = useState({
    operation: "add",
    quantity: "",
    reason: "",
    supplierNote: "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        operation: "add",
        quantity: "",
        reason: "",
        supplierNote: "",
      });
    }
  }, [open]);

  if (!open || !item) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const currentStock = Number(item.stock);
  const qty = Number(formData.quantity || 0);

  const updatedStock =
    formData.operation === "add"
      ? currentStock + qty
      : Math.max(currentStock - qty, 0);

  const handleSubmit = () => {
    onSave({
      ...item,
      stock: updatedStock,
      available:
        updatedStock - item.reserved >= 0
          ? updatedStock - item.reserved
          : 0,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-5">

          <div>

            <h2 className="text-2xl font-bold">
              Update Inventory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {item.title}

            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-8 p-8">

          {/* Stock Summary */}

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-gray-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Current Stock
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {item.stock}
              </h3>

            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">

              <p className="text-sm text-gray-500">
                Reserved
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {item.reserved}
              </h3>

            </div>

            <div className="rounded-xl bg-[#FFF8E6] p-5 text-center">

              <p className="text-sm text-gray-500">
                New Stock
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#C9A227]">
                {updatedStock}
              </h3>

            </div>

          </div>

          {/* Form */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Action
              </label>

              <select
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#C9A227] outline-none"
              >
                <option value="add">
                  Add Stock
                </option>

                <option value="remove">
                  Remove Stock
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#C9A227] outline-none"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Reason
              </label>

              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Stock Purchase / Customer Return / Damage..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#C9A227] outline-none"
              />

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block font-medium">
                Supplier Note
              </label>

              <textarea
                rows="4"
                name="supplierNote"
                value={formData.supplierNote}
                onChange={handleChange}
                placeholder="Additional notes..."
                className="w-full rounded-xl border border-gray-300 p-4 focus:border-[#C9A227] outline-none"
              />

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[#C9A227] px-8 py-3 font-semibold text-white transition hover:bg-[#b08d1f]"
          >
            Update Stock
          </button>

        </div>

      </div>

    </div>
  );
}

export default UpdateStockModal;