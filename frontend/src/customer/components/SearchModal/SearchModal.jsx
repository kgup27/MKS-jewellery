import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import api from "../../../services/api";

function SearchModal({ open, onClose }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearch("");
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!open) return null;

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    return (
      product.title.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value)
    );
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 p-6">
      <div className="mt-16 w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Search Products
          </h2>

          <button
            onClick={() => {
              setSearch("");
              onClose();
            }}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            ref={inputRef}
            type="text"
            placeholder="Search jewellery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-4 pl-14 pr-4 outline-none focus:border-[#C9A227]"
          />
        </div>

        {/* Result Count */}
        {search && (
          <p className="mb-4 mt-5 text-sm text-gray-500">
            {filteredProducts.length} Result
            {filteredProducts.length !== 1 && "s"} Found
          </p>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {search === "" ? (
            <p className="text-center text-gray-500">
              Start typing to search...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">
              No products found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => {
                    setSearch("");
                    onClose();
                  }}
                  className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-[#FAF7F2]"
                >
                  <img
                    loading="lazy"
                    src={
                      product.image_url ||
                      "https://placehold.co/100x100?text=No+Image"
                    }
                    alt={product.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {product.title}
                    </h3>

                    <p className="text-gray-500">
                      {product.category}
                    </p>

                    <p className="mt-1 font-bold text-[#C9A227]">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SearchModal;