import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // <-- Integrated Step 1

function Categories() {
  // Updated Category data with slugs (Step 2)
  const categories = [
    {
      id: 1,
      title: "Rings",
      slug: "rings",
      image: "https://placehold.co/300x300",
    },
    {
      id: 2,
      title: "Earrings",
      slug: "earrings",
      image: "https://placehold.co/300x300",
    },
    {
      id: 3,
      title: "Necklace",
      slug: "necklace",
      image: "https://placehold.co/300x300",
    },
    {
      id: 4,
      title: "Bangles",
      slug: "bangles",
      image: "https://placehold.co/300x300",
    },

    {
      id: 5,
      title: "Studs",
      slug: "studs",
      image: "https://placehold.co/300x300",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="mb-3 text-4xl font-bold">
            Shop by Category
          </h2>
          <p className="mb-12 text-gray-500">
            Explore our premium artificial jewellery collection.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((item, index) => (
            
            // Wrapped motion.div inside Link for seamless navigation (Step 3)
            <Link 
              key={item.id} 
              to={`/shop?category=${item.slug}`}
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
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.title}
                    className="h-72 w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"></div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold transition group-hover:text-[#C9A227]">
                    {item.title}
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