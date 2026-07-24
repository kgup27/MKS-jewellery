import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBanner from "../../../assets/banners/hero-banner.jpg";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2]">
      {/* Decorative Background */}
      <div className="absolute -top-24 -right-24 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -left-20 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-[#111111]/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:gap-20 lg:grid-cols-2">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-[#C9A227]"
            >
              ✨ New Collection 2026
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hero-title mt-6 sm:mt-8 text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-[#111111]"
            >
              Timeless
              <br />
              Elegance for
              <span className="text-[#C9A227]"> Every Occasion</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed sm:leading-8 text-gray-600"
            >
              Discover premium artificial jewellery crafted with elegance,
              designed to elevate your everyday style.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/shop"
                className="w-full sm:w-auto text-center rounded-xl bg-[#111111] px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#C9A227]"
              >
                Shop Collection
              </Link>

              <Link
                to="/about"
                className="w-full sm:w-auto text-center rounded-xl border-2 border-[#111111] px-8 py-4 font-semibold transition-all duration-300 hover:bg-[#111111] hover:text-white"
              >
                Explore More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-10 sm:mt-14 grid grid-cols-3 gap-4 sm:flex sm:gap-10 border-t border-gray-200/60 pt-8"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                  500+
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Happy Customers
                </p>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                  200+
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Premium Designs
                </p>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                  4.9★
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Customer Rating
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Container */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-4 top-4 sm:-left-6 sm:top-8 z-10 rounded-2xl bg-white/90 backdrop-blur-md p-3 sm:p-4 shadow-xl border border-gray-100"
            >
              <p className="text-xs sm:text-sm text-gray-500">Bestseller</p>
              <h4 className="text-sm sm:text-base font-bold text-[#111111]">
                Necklace Collection
              </h4>
            </motion.div>

            {/* Banner Image */}
            <motion.img
              loading="eager"
              fetchPriority="high"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              src={heroBanner}
              alt="MK Jewellers Collection"
              className="w-full h-[380px] sm:h-[520px] lg:h-auto object-cover rounded-2xl sm:rounded-[40px] shadow-2xl"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;