import { useEffect, useState } from "react";
import api from "../../../services/api";
import ProductCard from "../ProductCard/ProductCard";

function RecentlyViewed({ currentProduct }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (currentProduct) {
      fetchRecentlyViewed();
    }
  }, [currentProduct]);

  const fetchRecentlyViewed = async () => {
    try {
      const response = await api.get("/api/products");

      const filtered = response.data
        .filter((product) => product.id !== currentProduct.id)
        .slice(0, 4);

      setRecentlyViewed(filtered);
    } catch (error) {
      console.error("Failed to load recently viewed products:", error);
    }
  };

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="bg-[#FAF7F2] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Recently Viewed
        </h2>

        <p className="mt-3 text-center text-gray-500">
          Continue exploring our premium collection.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {recentlyViewed.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default RecentlyViewed;