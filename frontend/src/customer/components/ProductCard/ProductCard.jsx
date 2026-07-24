import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiHeart,
  FiEye,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import QuickViewModal from "../QuickViewModal/QuickViewModal";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const { wishlist, addToWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [openQuickView, setOpenQuickView] = useState(false);
  // Point 3: Cart Spam/Double-click Protection
  const [addingToCart, setAddingToCart] = useState(false);

  // Safe Unique Identifier (Works for local JSON, SQL id, or MongoDB _id)
  const productId = product?.id || product?._id;

  const isWishlisted = wishlist.some(
    (item) => (item.id || item._id) === productId
  );

  // Point 2: Price Safety (NaN Shield with Nullish Coalescing)
  const price = Number(product?.price ?? 0);
  const rawOldPrice = Number(product?.discounted_price ?? 0);
  const oldPrice = rawOldPrice > price ? rawOldPrice : price;

  const discount =
    product?.discount_percent ||
    (oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0);

  // Point 3: Safe Add To Cart Handler
  const handleAddToCart = async () => {
    if (addingToCart) return;
    setAddingToCart(true);

    try {
      await addToCart(product);
      toast.success("Added to Cart 🛒");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      await addToCart(product);
      setAddingToCart(false); // Debounce delay
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ y: -8 }}
        className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
      >
        {/* Top Image & Overlay Container */}
        <div className="relative overflow-hidden">
          <Link to={`/product/${productId}`}>
            {/* Point 1: Local WebP Fallback & Infinite-loop Safe onError */}
            <img
              loading="lazy"
              decoding="async"
              src={product?.image_url || "/placeholder-product.webp"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-product.webp";
              }}
              alt={product?.title || "Jewelry product"}
              className="aspect-square w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            />
          </Link>

          {/* Wishlist Button (Mobile Friendly & Accessible) */}
          <button
            onClick={() => {
              if (isWishlisted) {
                toast("Already in Wishlist ❤️");
              } else {
                addToWishlist(product);
                toast.success("Added to Wishlist ❤️");
              }
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#C9A227] hover:text-white opacity-100 md:opacity-80 md:group-hover:opacity-100 group-hover:opacity-100"
          >
            <FiHeart
              size={18}
              className={isWishlisted ? "fill-red-500 text-red-500" : ""}
            />
          </button>

          {/* Point 4: Quick View - Touch Friendly for Mobile & Hover for Desktop */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-100 transition-all duration-500 md:inset-0 md:items-center md:bg-black/30 md:opacity-0 md:group-hover:opacity-100">
            <button
              onClick={() => setOpenQuickView(true)}
              aria-label="Quick view product details"
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-gray-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#C9A227] hover:text-white md:text-sm"
            >
              <FiEye size={16} />
              Quick View
            </button>
          </div>

          {/* Brand Badge */}
          <span className="absolute left-4 top-4 rounded-full bg-[#C9A227] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {product?.brand || "MK Jewellers"}
          </span>

          {/* Conditional Discount Badge */}
          {discount > 0 && (
            <span className="absolute right-4 bottom-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="flex flex-grow flex-col justify-between p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[2px] text-gray-400">
              {product?.category}
            </p>

            <Link
              to={`/product/${productId}`}
              className="mt-1 block line-clamp-2 text-lg font-bold text-gray-900 transition hover:text-[#C9A227]"
              title={product?.title}
            >
              {product?.title}
            </Link>

            {product?.rating && (
              <div className="mt-2 flex items-center gap-1.5">
                <FiStar className="fill-yellow-400 text-yellow-400" size={16} />
                <span className="text-sm font-semibold text-gray-700">
                  {product.rating}
                </span>
              </div>
            )}
          </div>

          <div>
            {/* Formatted Price Layout */}
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-[#111111]">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {oldPrice > price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{oldPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Point 3: Disabled state during active submission */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              aria-label={`Add ${product?.title || "product"} to cart`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#C9A227] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiShoppingBag size={18} />
              {addingToCart ? "Adding..." : "Add To Cart"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        open={openQuickView}
        onClose={() => setOpenQuickView(false)}
        product={product}
      />
    </>
  );
}

export default ProductCard;