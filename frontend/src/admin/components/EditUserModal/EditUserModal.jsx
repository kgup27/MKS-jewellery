import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

function EditUserModal({ open, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "Active",
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave({
      ...user,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h2 className="text-2xl font-bold">Edit Customer</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update customer information.
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
        <div className="grid gap-6 p-8 md:grid-cols-2">
          
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Phone (Read-Only/Disabled) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-600">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || "N/A"}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-400 outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Phone number can only be updated by the customer.
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
            >
              <option>Active</option>
              <option>VIP</option>
              <option>Blocked</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b08d1f]"
          >
            Update Customer
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditUserModal;