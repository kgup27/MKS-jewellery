import { useState, useEffect } from "react"; // Combined useState and useEffect
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";

import ProductTable from "../../components/ProductTable/ProductTable";
import ProductModal from "../../components/ProductModal/ProductModal";
import Pagination from "../../components/Pagination/Pagination";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import ViewProductModal from "../../components/ViewProductModal/ViewProductModal";

// API service import
import api from "../../../services/api";

function Products() {
  // Existing Modal States
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Delete States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  
  // View States
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null); 

  // Step 10.2: API Data & Loading States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Step 10.3: Fetch Products on Component Mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // 👇 Handle Delete Function Added Here
  const handleDelete = async () => {
    try {
      await api.delete(
        `/api/admin/products/${deleteProduct.product_id}`
      );

      toast.success("Product deleted successfully");

      setDeleteOpen(false);
      setDeleteProduct(null);

      fetchProducts(); // Refresh list after deletion
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error ||
        "Failed to delete product"
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="mt-2 text-gray-500">
            Manage all jewellery products in your inventory.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b28c1f]"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          <select className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]">
            <option>All Categories</option>
            <option>Ring</option>
            <option>Necklace</option>
            <option>Bracelet</option>
            <option>Earrings</option>
          </select>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 hover:bg-gray-50">
            <FaFilter />
            Filter
          </button>
        </div>
      </div>

      {/* Step 10.4: Product Table with products and loading props */}
      <ProductTable
        products={products}
        loading={loading}
        onView={(product) => {
          setViewProduct(product);
          setViewOpen(true);
        }}
        onEdit={(product) => {
          setSelectedProduct(product);
          setOpenModal(true);
        }}
        onDelete={(product) => {
          setDeleteProduct(product);
          setDeleteOpen(true);
        }}
      />

      <Pagination />

      {/* Product Form Modal */}
      <ProductModal
        open={openModal}
        product={selectedProduct}
        fetchProducts={fetchProducts}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
      />

      {/* View Product Modal */}
      <ViewProductModal
        open={viewOpen}
        product={viewProduct}
        onClose={() => {
          setViewOpen(false);
          setViewProduct(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteOpen}
        product={deleteProduct}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteProduct(null);
        }}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default Products;