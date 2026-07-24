import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function OffersBanner({
  badgeText = "Limited Time Offer",
  headline = "Flat 40% OFF",
  description = "Discover premium jewellery crafted for every occasion. Shop today and enjoy exclusive festive discounts with free shipping across India.",
  ctaText = "Shop Now",
  ctaLink = "/shop",
}) {
  return (
    <section className="bg-[#111111] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Animated Banner Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          /* Refinement 1: Height & Impact Bump */
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111111] via-[#2B2B2B] to-[#111111] px-6 py-14 text-center shadow-2xl ring-1 ring-white/10 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
        >
          {/* Top Ambient Gold Glow */}
          <div 
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#C9A227]/10 blur-3xl" 
            aria-hidden="true" 
          />

          {/* Refinement 4: Secondary Subtle Bottom Glow for Visual Balance */}
          <div
            className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#C9A227]/5 blur-3xl"
            aria-hidden="true"
          />

          {/* Badge */}
          <span className="relative z-10 text-xs font-semibold uppercase tracking-[4px] text-[#C9A227] sm:text-sm sm:tracking-[5px]">
            {badgeText}
          </span>

          {/* Headline */}
          <h2 className="relative z-10 mt-4 text-3xl font-bold tracking-tight text-white sm:mt-6 sm:text-4xl lg:text-6xl">
            {headline}
          </h2>

          {/* Refinement 3: Improved Mobile Paragraph Width & Readability */}
          <p className="relative z-10 mx-auto mt-4 max-w-lg text-base text-gray-300 sm:mt-6 sm:max-w-2xl sm:text-lg">
            {description}
          </p>

          {/* Refinement 2: Premium CTA Hover Mechanics */}
          <div className="relative z-10 mt-8 sm:mt-10">
            <Link
              to={ctaLink}
              className="inline-flex items-center justify-center rounded-xl bg-[#C9A227] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white hover:text-[#111111] hover:shadow-2xl active:scale-95"
            >
              {ctaText}
            </Link>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default OffersBanner;