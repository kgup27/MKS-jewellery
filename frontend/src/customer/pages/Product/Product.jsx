import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import {
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiShare2,
  FiCopy,
} from "react-icons/fi";

import MainLayout from "../../layouts/MainLayout";
import api from "../../../services/api"; // Updated path to service
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import RecentlyViewed from "../../components/RecentlyViewed/RecentlyViewed";
import SkeletonProduct from "../../components/Skeleton/SkeletonProduct";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ImageLightbox from "../../components/ImageLightbox/ImageLightbox";
import ProductTabs from "../../components/ProductTabs/ProductTabs";

function Product() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(
          res.data.image_url || "https://placehold.co/600x600?text=No+Image"
        );
        setSelectedColor(res.data.color || "");
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Wishlist check backup with _id and id safely
  const isWishlisted = wishlist.some(
    (item) => String(item.id || item._id) === String(product?.id || product?._id)
  );
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Safe Loading check first before showing "Not Found"
  if (loading) {
    return (
      <MainLayout>
        <SkeletonProduct />
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <section className="py-24 text-center">
          <h2 className="text-4xl font-bold">Product Not Found</h2>
        </section>
      </MainLayout>
    );
  }

  // NaN Safe Discount Calculation
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.discounted_price || product.oldPrice) > price
      ? Number(product.discounted_price || product.oldPrice)
      : price;

  const discount = product.discount_percent 
    ? Number(product.discount_percent)
    : oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  return (
    <MainLayout>
      <section className="bg-[#FAF7F2] py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb />
          
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Product Image */}
            <div>
              <div
                className="overflow-hidden rounded-3xl relative"
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  setZoomStyle({
                    transformOrigin: `${x}% ${y}%`,
                    transform: "scale(2)",
                  });
                }}
                onMouseLeave={() => setZoomStyle({ transform: "scale(1)" })}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={selectedImage}
                  alt={product.title}
                  onClick={() => setLightboxOpen(true)}
                  className="h-80 w-full cursor-zoom-in rounded-3xl object-cover shadow-xl transition-transform duration-300 sm:h-[450px] lg:h-[650px]"
                  style={zoomStyle}
                />
              </div>

              {/* Thumbnails */}
              <div className="mt-5 grid grid-cols-4 gap-4">
                {[product.image_url || "https://placehold.co/600x600?text=No+Image"].map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === image ? "border-[#C9A227]" : "border-transparent hover:border-[#C9A227]"
                    }`}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <p className="uppercase tracking-[4px] text-[#C9A227] font-semibold">
                {product.category}
              </p>

              <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                  ₹{price}
                </span>
                {oldPrice > price && (
                  <span className="text-2xl line-through text-gray-400">
                    ₹{oldPrice}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-sm text-white font-semibold">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-1 text-amber-500">
                ⭐ <span className="text-gray-700 ml-1 font-medium">{product.rating || "4.5"} / 5</span>
              </div>

              <p className="mt-8 leading-8 text-gray-600">{product.description}</p>

              <p className={`mt-5 font-semibold ${product.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.quantity > 0 ? `In Stock : ${product.quantity}` : "Out of Stock"}
              </p>

              {/* Quantity */}
              <div className="mt-10">
                <h3 className="mb-4 font-semibold">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="h-10 w-10 rounded-lg border font-bold hover:bg-gray-100"
                    disabled={product.quantity <= 0}
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg border font-bold hover:bg-gray-100"
                    disabled={product.quantity <= 0}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => {
                    if(product.quantity <= 0) return toast.error("Product is out of stock");
                    addToCart({
                      ...product,
                      id: product.id || product._id,
                      quantity,
                      price
                    });
                    toast.success("Added to Cart 🛒");
                  }}
                  disabled={product.quantity <= 0}
                  className="flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-white transition hover:bg-[#C9A227] disabled:bg-gray-400"
                >
                  <FiShoppingBag /> Add To Cart
                </button>

                <button 
                  disabled={product.quantity <= 0}
                  className="rounded-xl border px-8 py-4 transition hover:bg-[#111111] hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => {
                    if (isWishlisted) {
                      if(removeFromWishlist) removeFromWishlist(product.id || product._id);
                      toast("Removed from Wishlist 💔");
                    } else {
                      addToWishlist(product);
                      toast.success("Added to Wishlist ❤️");
                    }
                  }}
                  className={`rounded-xl border p-4 transition ${
                    isWishlisted ? "bg-red-500 text-white border-red-500" : "hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <FiHeart size={22} />
                </button>
              </div>

              {/* Share Product */}
              <div className="mt-10">
                <h3 className="mb-4 font-semibold">Share Product</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-2 rounded-xl border px-5 py-3 transition hover:bg-[#111111] hover:text-white"
                  >
                    <FiCopy /> Copy Link
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border px-5 py-3 transition hover:bg-green-600 hover:text-white"
                  >
                    <FiShare2 /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-12 space-y-5">
                <div className="flex items-center gap-3">
                  <FiTruck size={22} />
                  <p>Free Delivery Across India</p>
                </div>
                <div className="flex items-center gap-3">
                  <FiShield size={22} />
                  <p>Secure Payment & Easy Returns</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <ProductTabs product={product} />
      <RelatedProducts currentProduct={product} />
      <RecentlyViewed currentProduct={product} />
      <ImageLightbox open={lightboxOpen} image={selectedImage} onClose={() => setLightboxOpen(false)} /> 
    </MainLayout>
  );
}    

export default Product;