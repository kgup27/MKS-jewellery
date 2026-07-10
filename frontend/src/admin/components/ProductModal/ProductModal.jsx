import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../../../services/api";
import toast from "react-hot-toast";

function ProductModal({
  open,
  onClose,
  product = null,
  fetchProducts,
}) {
  // Form Data State
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    image_url: "",
  });

  // Sync product data with state
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
        category: product.category || "",
        image_url: product.image_url || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        image_url: "",
      });
    }
  }, [product]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add & Update API Calls
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevents page reload on form submit

    // Client-side backup validation
    if (!formData.title || !formData.price || !formData.quantity) {
      toast.error("Please fill all required fields (Title, Price, Quantity)");
      return;
    }

    try {
      setLoading(true);

      if (product) {
        // Update API
        await api.put(
          `/api/admin/products/${product.id}`,
          formData
        );
        toast.success("Product updated successfully");
      } else {
        // Add API
        await api.post(
          "/api/admin/products",
          formData
        );
        toast.success("Product added successfully");
      }

      // Recommendation 1: Safe call for fetchProducts
      if (fetchProducts) {
        await fetchProducts();
      }
      
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error ||
        "Failed to save product"
      );
    } finally {
      setLoading(false);
    }
  };

  // Early return shifted below hooks
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Recommendation 2: Changed div to form and hooked onSubmit */}
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {product ? "Update the product details below." : "Fill all product details below."}
            </p>
          </div>

          <button
            type="button" // Specified type to prevent accidental form triggers
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          
          {/* Product Title (Required) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Diamond Ring"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            >
              <option value="">Select Category</option>
              <option value="Ring">Ring</option>
              <option value="Necklace">Necklace</option>
              <option value="Bracelet">Bracelet</option>
              <option value="Earrings">Earrings</option>
              <option value="Pendant">Pendant</option>
              <option value="Bangles">Bangles</option>
            </select>
          </div>

          {/* Price (Required) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="24999"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Quantity (Required) */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="50"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Product Image URL */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">
              Product Image URL
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>
            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#C9A227]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t px-8 py-5">
          <button
            type="button" // Specified type to prevent accidental form triggers
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          {/* Recommendation 2: Changed type to "submit" */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b08d1f] disabled:opacity-50"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Save Product"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProductModal;