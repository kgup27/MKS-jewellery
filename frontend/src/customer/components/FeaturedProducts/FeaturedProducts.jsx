import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// 🔴 1. Updated Import: Using central productService instead of direct api call
import productService from "../../../services/productService";
import ProductCard from "../ProductCard/ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // 🔴 1. API Call: Simplified using productService
      const data = await productService.getAllProducts();
      
      // 🔴 8. Slice first 8 products (or backend filtered featured items)
      setProducts(data.slice(0, 8));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔴 2, 4, 5. Modern Skeleton Loading state with responsive grid & padding
  if (loading) {
    return (
      <section className="bg-[#F8F6F2] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🔴 7. Empty State handling
  if (products.length === 0) {
    return (
      <section className="bg-[#F8F6F2] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Products Found
          </h2>
        </div>
      </section>
    );
  }

  return (
    // 🔴 4. Responsive Section Padding
    <section className="bg-[#F8F6F2] py-14 sm:py-16 lg:py-20">
      {/* 🔴 5. Responsive Container Padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* 🔴 6. Responsive Heading Size */}
          <h2 className="text-3xl sm:text-4xl font-bold">
            Featured Collection
          </h2>

          <p className="mt-3 mb-12 text-gray-500">
            Handpicked premium jewellery for every occasion.
          </p>
        </motion.div>

        {/* 🔴 3. Responsive Grid Layout (Mobile: 2, Tablet: 3, Desktop: 4) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{
            staggerChildren: 0.15,
          }}
          variants={{
            hidden: {},
            show: {},
          }}
          className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div
              key={product.id || product._id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
                },
                show: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default FeaturedProducts;