import { FiX, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

function QuickViewModal({ open, onClose, product }) {
  const { addToCart } = useCart();

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-gray-100"
        >
          <FiX size={24} />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 sm:p-8">

          {/* Image */}
          <img
            src={
              product.image_url ||
              "https://placehold.co/600x600?text=No+Image"
            }
            alt={product.title}
            className="h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-[500px]"
          />

          {/* Details */}
          <div className="flex flex-col justify-center">

            <p className="uppercase tracking-[4px] text-[#C9A227] font-semibold">
              {product.category}
            </p>

            <h2 className="mt-3 text-3xl lg:text-4xl font-bold">
              {product.title}
            </h2>

            <div className="mt-5 flex items-center gap-4 flex-wrap">

              <span className="text-2xl lg:text-3xl font-bold">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.discounted_price > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{Number(product.discounted_price).toLocaleString("en-IN")}
                </span>
              )}

            </div>

            <p className="mt-6 text-gray-600 leading-7">
              {product.description}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="rounded-xl border border-[#C9A227] px-6 py-3 text-center font-semibold transition hover:bg-[#C9A227] hover:text-white"
              >
                View Details
              </Link>

              <button
                onClick={() => {
                  addToCart(product);
                  toast.success("Added to Cart 🛒");
                  onClose();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-white transition hover:bg-[#C9A227]"
              >
                <FiShoppingBag />
                Add To Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default QuickViewModal;