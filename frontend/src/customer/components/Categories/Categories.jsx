import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import categoryService from "../../../services/categoryService";

function Categories() {
  // Step 2: Static array delete karke dynamic state assign kar di hai
  const [categories, setCategories] = useState([]);

  // Step 3: API Call useEffect ke through
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="mb-3 text-3xl sm:text-4xl font-bold">
            Shop by Category
          </h2>
          <p className="mb-12 text-gray-500">
            Explore our premium artificial jewellery collection.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {categories.map((item, index) => (
            // Step 6: Query parameter me slug ki jagah item.name use kiya hai
            <Link 
              key={item.category_id}
              to={`/shop?category=${item.name}`}
              className="block"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                }}
                className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow transition-all duration-500 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  {/* Step 5: item.image ki jagah item.image_url update ho gaya hai */}
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image_url}
                    alt={item.name}
                    className="aspect-square w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"></div>
                </div>

                <div className="p-5">
                  {/* Step 4: item.title ki jagah item.name render ho raha hai */}
                  <h3 className="text-xl font-semibold transition group-hover:text-[#C9A227]">
                    {item.name}
                  </h3>
                  <button className="mt-4 font-medium text-[#C9A227] transition-all duration-300 group-hover:translate-x-2">
                    Explore →
                  </button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;