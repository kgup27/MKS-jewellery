import { useEffect, useState } from "react";
import api from "../../../services/api";
import ProductCard from "../ProductCard/ProductCard";

function RelatedProducts({ currentProduct }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (currentProduct) {
      fetchRelatedProducts();
    }
  }, [currentProduct]);

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get("/api/products");

      const filtered = response.data
        .filter(
          (product) =>
            product.category === currentProduct.category &&
            product.id !== currentProduct.id
        )
        .slice(0, 4);

      setRelatedProducts(filtered);
    } catch (error) {
      console.error("Failed to load related products:", error);
    }
  };

  if (relatedProducts.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Related Products
        </h2>

        <p className="mt-3 text-center text-gray-500">
          You may also like these jewellery items.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product) => (
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

export default RelatedProducts;