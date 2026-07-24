import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";
import SearchModal from "../SearchModal/SearchModal";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Collections", path: "/collections" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { isAuthenticated } = useCustomerAuth();

  // Smart Cart Count: Calculates total item quantities inside cart array
  const totalCartItems = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // 1. Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // 2. Close drawer on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Scroll position detection for elevation/shadow toggle
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        {/* Responsive Height & Padding Adjustment */}
        <div className="max-w-[1400px] mx-auto h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 select-none">
            <img
              src="/mk-logo.png"
              alt="MK Jewellers"
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-wide text-[#111111] leading-tight">
                MK Jewellers
              </h1>
              <p className="text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[2px] sm:tracking-[4px] text-gray-500">
                Premium Jewellery
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative group text-sm font-medium tracking-wide transition-all duration-300 ${
                      isActive
                        ? "text-[#C9A227]"
                        : "text-gray-700 hover:text-[#C9A227]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      <span
                        className={`absolute left-0 -bottom-2 h-0.5 rounded-full bg-[#C9A227] transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-[#F8F6F2] hover:text-[#C9A227] transition hover:scale-105"
            >
              <FiSearch size={19} />
            </button>

            {/* Wishlist - Desktop Only */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden md:flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center text-gray-700 hover:bg-[#F8F6F2] hover:text-[#C9A227] transition hover:scale-105"
            >
              <FiHeart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-[#C9A227] text-[10px] font-bold text-white shadow-xs">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-[#F8F6F2] hover:text-[#C9A227] transition hover:scale-105"
            >
              <FiShoppingBag size={19} />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-[#111111] text-[10px] font-bold text-white shadow-xs">
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </span>
              )}
            </Link>

            {/* Desktop Auth Button */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="hidden lg:flex items-center gap-2 rounded-xl border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#111111] transition hover:bg-[#C9A227] hover:text-white ml-2"
              >
                <FiUser size={16} />
                <span>My Account</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex items-center rounded-xl border border-[#C9A227] px-5 py-2 text-sm font-medium text-[#111111] transition hover:bg-[#C9A227] hover:text-white ml-2"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-[#F8F6F2] hover:text-[#C9A227] transition"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Slide Panel */}
      {menuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          {/* Overlay Backplate */}
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          ></div>

          {/* Responsive Width Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/mk-logo.png"
                    alt="MK Jewellers"
                    className="h-10 w-10 rounded-lg object-contain"
                  />
                  <div>
                    <h2 className="text-base font-bold text-[#111111]">
                      MK Jewellers
                    </h2>
                    <p className="text-[9px] uppercase tracking-[2px] text-gray-500">
                      Premium Jewellery
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 hover:bg-gray-100 text-gray-600 transition"
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 flex flex-col gap-4">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-medium py-1 transition ${
                        isActive
                          ? "text-[#C9A227] font-semibold"
                          : "text-gray-700 hover:text-[#C9A227]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

                <hr className="my-2 border-gray-100" />

                <NavLink
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium py-1 transition ${
                      isActive
                        ? "text-[#C9A227]"
                        : "text-gray-700 hover:text-[#C9A227]"
                    }`
                  }
                >
                  <FiHeart size={18} />
                  <span>Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-semibold">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium py-1 transition ${
                      isActive
                        ? "text-[#C9A227]"
                        : "text-gray-700 hover:text-[#C9A227]"
                    }`
                  }
                >
                  <FiShoppingBag size={18} />
                  <span>Cart</span>
                  {totalCartItems > 0 && (
                    <span className="ml-auto rounded-full bg-[#111111] px-2 py-0.5 text-xs text-white font-semibold">
                      {totalCartItems}
                    </span>
                  )}
                </NavLink>
              </div>
            </div>

            {/* Bottom Actions Section */}
            <div className="pt-6 mt-6 border-t border-gray-100">
              {isAuthenticated ? (
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] py-3 text-center text-sm font-medium text-white transition hover:bg-black shadow-sm"
                >
                  <FiUser size={18} />
                  <span>My Account</span>
                </NavLink>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl bg-[#111111] py-3 text-center text-sm font-medium text-white transition hover:bg-[#C9A227] shadow-sm"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Navbar;