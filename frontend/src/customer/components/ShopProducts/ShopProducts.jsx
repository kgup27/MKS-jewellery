import { useEffect, useState } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";
import ProductCard from "../ProductCard/ProductCard";

function ShopProducts({ search, category, sortBy }) {
  // Step 2: Initialize State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState(8);

  // Step 3: Fetch Products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Run Fetch on Component Mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Step 5: Search + Category Filter (Updated product.name to product.title)
  let filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    const matchesSearch =
      product.title.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Step 6: Updated Sorting Logic (Handling Type Casting & Safe Removals)
  switch (sortBy) {
    case "Price Low → High":
      filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
      break;

    case "Price High → Low":
      filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
      break;

    default:
      break;
  }

  // Step 7: Handle Loading State
  if (loading) {
    return (
      <section className="py-20 text-center text-xl font-medium text-gray-600">
        Loading products...
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-[#111111]">
              All Products
            </h2>
            <p className="mt-2 text-gray-500">
              {filteredProducts.length} Products Found
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-3xl font-bold">No Products Found</h3>
            <p className="mt-4 text-gray-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts
                .slice(0, visibleProducts)
                .map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
            </div>

            {/* Load More Button */}
            {visibleProducts < filteredProducts.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleProducts((prev) => prev + 8)}
                  className="rounded-xl bg-[#111111] px-8 py-4 font-semibold text-white transition hover:bg-[#C9A227]"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ShopProducts;