import toast from "react-hot-toast";
import api from "../../../services/api";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const initialState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  featured: false,
  status: "Active",
};

function CategoryModal({
  open,
  onClose,
  category,
  onSave,
}) {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        image: category.image || "",
        featured: category.featured || false,
        status: category.status || "Active",
      });
    } else {
      setFormData(initialState);
    }
  }, [category, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Asynchronous Submissions & API Management (Step 1)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Category Name and Slug are required");
      return;
    }

    try {
      setLoading(true);

      if (category) {
        await api.put(
          `/api/admin/categories/${category.id}`,
          formData
        );
        toast.success("Category updated successfully");
      } else {
        await api.post(
          "/api/admin/categories",
          formData
        );
        toast.success("Category added successfully");
      }

      if (onSave) {
        await onSave();
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error ||
        "Failed to save category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in category information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2"
        >

          {/* Name */}
          <div>
            <label className="mb-2 block font-medium">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rings"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block font-medium">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="rings"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
              required
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Category Image
            </label>
            <input
              type="file"
              className="w-full rounded-xl border border-dashed border-gray-300 p-3"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Description
            </label>
            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description..."
              className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Featured */}
          <div>
            <label className="mb-2 block font-medium">
              Featured
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Category
            </label>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block font-medium">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>

            {/* Submit Button with Loading Feedback (Step 2) */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#C9A227] px-8 py-3 font-semibold text-white transition hover:bg-[#b08d1f] disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : category
                ? "Update Category"
                : "Save Category"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default CategoryModal;