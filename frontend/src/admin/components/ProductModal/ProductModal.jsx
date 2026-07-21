import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import adminApi from "../../../services/adminApi";
import toast from "react-hot-toast";

function ProductModal({ open, onClose, product = null, fetchProducts }) {
  const [loading, setLoading] = useState(false);
  
  // 1. Dynamic Category State Added
  const [categories, setCategories] = useState([]);
  
  // Form Data State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discounted_price: "",
    discount_percent: "",
    quantity: "",
    brand: "",
    color: "",
    category: "",
    image_url: "",
    is_active: true,
  });

  // 1. Fetch categories from backend API
  const fetchCategories = async () => {
    try {
      const response = await adminApi.get("/api/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Load categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync product data with state
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        discounted_price: product.discounted_price || "",
        discount_percent: product.discount_percent || "",
        quantity: product.quantity || "",
        brand: product.brand || "",
        color: product.color || "",
        category: product.category || "",
        image_url: product.image_url || "",
        is_active: product.is_active ?? true,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        discounted_price: "",
        discount_percent: "",
        quantity: "",
        brand: "",
        color: "",
        category: "",
        image_url: "",
        is_active: true,
      });
    }
  }, [product]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add & Update API Calls
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Client-side backup validation
    if (!formData.title || !formData.price || !formData.quantity) {
      toast.error("Please fill all required fields (Title, Price, Quantity)");
      return;
    }

    // 4. Price Validation
    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    // 2. Discount Validation
    if (
      formData.discounted_price &&
      Number(formData.discounted_price) > Number(formData.price)
    ) {
      toast.error("Discount price cannot be greater than price");
      return;
    }

    // 3. Quantity Validation
    if (Number(formData.quantity) < 0) {
      toast.error("Quantity cannot be negative");
      return;
    }

    try {
      setLoading(true);

      if (product) {
        // Update API
        await adminApi.put(`/api/admin/products/${product.id}`, formData);
        toast.success("Product updated successfully");
      } else {
        // Add API
        await adminApi.post("/api/admin/products", formData);
        toast.success("Product added successfully");
      }

      if (fetchProducts) {
        await fetchProducts();
      }

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-5 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {product ? "Update the product details below." : "Fill all product details below."}
            </p>
          </div>

          <button
            type="button"
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

          {/* 1. Dynamic Dropdown Mapping */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option 
                  key={cat.category_id} 
                  value={cat.name}
                >
                  {cat.name}
                </option>
              ))}
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

          {/* Discount Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Discount Price
            </label>
            <input
              type="number"
              name="discounted_price"
              value={formData.discounted_price}
              onChange={handleChange}
              placeholder="19999"
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

          {/* Discount % */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Discount %
            </label>
            <input
              type="number"
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleChange}
              placeholder="10"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Tanishq"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Color
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Gold"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Product Image URL */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Product Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#C9A227]"
            />
            {/* 5. Image Preview */}
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="mt-3 h-40 rounded-xl border object-cover"
                onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image URL is invalid
              />
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Description</label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Status Toggle / Checkbox */}
          <div className="md:col-span-2 flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227] accent-[#C9A227]"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
              Product is Active (Visible to users)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t px-8 py-5 sticky bottom-0 bg-white z-10">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

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