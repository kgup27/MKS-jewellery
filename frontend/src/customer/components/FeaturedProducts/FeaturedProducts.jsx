import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../services/api";

import ProductCard from "../ProductCard/ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/products");

      // Sirf first 8 products dikhayenge
      setProducts(response.data.slice(0, 8));
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

  if (loading) {
    return (
      <section className="bg-[#F8F6F2] py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-2xl font-semibold">
            Loading Products...
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8F6F2] py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold">
            Featured Collection
          </h2>

          <p className="mt-3 mb-12 text-gray-500">
            Handpicked premium jewellery for every occasion.
          </p>
        </motion.div>

        {/* Products */}
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
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
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