import { motion } from "framer-motion";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiAward,
} from "react-icons/fi";

const features = [
  {
    icon: <FiTruck size={28} />,
    title: "Free Shipping",
    description: "On orders above ₹999",
  },
  {
    icon: <FiAward size={28} />,
    title: "Premium Quality",
    description: "Beautiful artificial jewellery",
  },
  {
    icon: <FiShield size={28} />,
    title: "Secure Payment",
    description: "100% safe transactions",
  },
  {
    icon: <FiRefreshCw size={28} />,
    title: "Easy Returns",
    description: "Hassle-free return policy",
  },
];

function WhyChoose() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Why Choose MK Jewellers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500">
            Luxury designs with trusted service.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={index}
              tabIndex={0}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group flex h-full flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 text-center outline-none transition-all duration-300 hover:border-[#C9A227] hover:shadow-xl hover:shadow-[#C9A227]/5 focus-visible:border-[#C9A227] focus-visible:ring-2 focus-visible:ring-[#C9A227]/20"
            >
              {/* Icon Container */}
              <div className="mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227] transition-all duration-300 group-hover:bg-[#C9A227] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 group-focus-visible:bg-[#C9A227] group-focus-visible:text-white">
                {item.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChoose;