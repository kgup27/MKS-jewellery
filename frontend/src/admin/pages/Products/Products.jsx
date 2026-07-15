import { useState, useEffect } from "react"; 
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";

import ProductTable from "../../components/ProductTable/ProductTable";
import ProductModal from "../../components/ProductModal/ProductModal";
import Pagination from "../../components/Pagination/Pagination";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import ViewProductModal from "../../components/ViewProductModal/ViewProductModal";

// API service import
import adminApi from "../../../services/adminApi";

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

  // API Data & Loading States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Category States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // 🔹 Step 7.1: Pagination states configured below
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Client-side Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // 🔹 Step 7.2: Slice calculation logic for current page context
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  
  // Current visible window of paginated items
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  // 🔹 Step 7.4: Reset current view scope to Page 1 when parameters shift
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  // Handle Delete Function
  const handleDelete = async () => {
    try {
      await adminApi.delete(`/api/admin/products/${deleteProduct.id}`);
      toast.success("Product deleted successfully");
      setDeleteOpen(false);
      setDeleteProduct(null);
      fetchProducts(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
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

      {/* Search & Filter Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
          >
            <option value="">All Categories</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Earrings">Earrings</option>
            <option value="Pendant">Pendant</option>
            <option value="Bangles">Bangles</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 transition hover:bg-gray-50 text-gray-700 font-medium"
          >
            <FaFilter />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Live Item Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-800">
            {Math.min(indexOfLastProduct, filteredProducts.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {filteredProducts.length}
          </span>{" "}
          products (filtered from {products.length} total)
        </p>
      </div>

      {/* 🔹 Step 7.3: Product Table ko updated currentProducts assign kar diya */}
      <ProductTable
        products={currentProducts}
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

      {/* 🔹 Step 7.5: Connect Pagination component props */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalProducts={filteredProducts.length}
        productsPerPage={productsPerPage}
      />

      {/* Modals */}
      <ProductModal
        open={openModal}
        product={selectedProduct}
        fetchProducts={fetchProducts}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
      />

      <ViewProductModal
        open={viewOpen}
        product={viewProduct}
        onClose={() => {
          setViewOpen(false);
          setViewProduct(null);
        }}
      />

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