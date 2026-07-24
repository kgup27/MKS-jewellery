import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      image: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      review:
        "Absolutely loved the jewellery quality. It looks premium and elegant. Highly recommended!",
      verified: true,
    },
    {
      id: 2,
      name: "Ananya Gupta",
      image: "https://i.pravatar.cc/150?img=32",
      rating: 5,
      review:
        "Beautiful designs and quick delivery. The necklace looked exactly like the pictures.",
      verified: true,
    },
    {
      id: 3,
      name: "Sneha Verma",
      image: "https://i.pravatar.cc/150?img=47",
      rating: 5,
      review:
        "Amazing customer service and premium finish. I'll definitely shop again.",
      verified: true,
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Thousands of happy customers trust our jewellery.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 0.5,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
              }}
              className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-[#C9A227] hover:shadow-2xl hover:shadow-[#C9A227]/5 sm:p-8"
            >
              {/* Reviewer Header */}
              <div className="flex items-center gap-4">
                <img
                  loading="lazy"
                  decoding="async"
                  src={review.image}
                  alt={review.name}
                  onError={(e) => {
                    e.currentTarget.src = "/images/avatar-placeholder.webp";
                  }}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-[#C9A227]/20 sm:h-16 sm:w-16"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    {review.name}
                  </h3>

                  {review.verified && (
                    <p className="text-xs font-medium text-[#C9A227]">
                      Verified Buyer
                    </p>
                  )}

                  <div className="mt-1 flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className="mt-6 flex-grow italic leading-7 text-gray-500">
                "{review.review}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;