import React from 'react';
import { motion } from 'framer-motion';
import { FiInstagram } from 'react-icons/fi';

function InstagramSection() {
  // Replace these placeholders with your imported local assets (e.g., from 'src/assets/images/instagram/')
  const posts = [
    "https://placehold.co/400x400",
    "https://placehold.co/400x400",
    "https://placehold.co/400x400",
    "https://placehold.co/400x400",
    "https://placehold.co/400x400",
    "https://placehold.co/400x400",
  ];

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Animated Header Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[#C9A227] uppercase tracking-[4px] text-xs sm:text-sm font-semibold">
            Follow Us
          </p>

          <h2 className="mt-2 text-3xl font-bold sm:text-4xl text-gray-900">
            Instagram Gallery
          </h2>

          <p className="mx-auto mt-3 mb-12 max-w-xl text-gray-500">
            Discover our latest jewellery collections and behind-the-scenes moments.
          </p>
        </motion.div>

        {/* Staggered Animated Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl shadow-lg group cursor-pointer aspect-square"
            >
              <img
                src={post}
                alt={`MK Jewellers Instagram post ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Premium Hover Overlay with Instagram Icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <FiInstagram className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/_mk_jewellers_1111"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#C9A227] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#111111] transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            <FiInstagram className="text-xl" />
            <span>Follow us on Instagram</span>
          </a>
          <p className="mt-2 text-xs text-gray-400 font-mono">@_mk_jewellers_1111</p>
        </motion.div>

      </div>
    </section>
  );
}

export default InstagramSection;