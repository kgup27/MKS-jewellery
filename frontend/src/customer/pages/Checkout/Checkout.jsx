import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import MainLayout from "../../layouts/MainLayout";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import toast from "react-hot-toast";
import api from "../../../services/api"; 

function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useCustomerAuth();

  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 1. Safe Subtotal Calculation (Handles both price and price_at_time fields)
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || item.price_at_time || 0) * (item.quantity || 1),
    0
  );

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place your order.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const { fullName, email, phone, city, address, pincode, paymentMethod } = checkoutData;
    if (!fullName || !email || !phone || !city || !address || !pincode) {
      toast.error("Please fill out all the billing fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/orders", {
        fullName,
        email,
        phone,
        city,
        address,
        pincode,
        paymentMethod,
      });

      toast.success(response.data.message || "Order placed successfully!");
      
      if (clearCart) {
        clearCart();
      }
      
      // ✅ Updated to pass orderId in state history
      navigate("/order-success", {
        state: {
          orderId: response.data.orderId,
        },
      });
    } catch (error) {
      console.error("Order processing failed:", error);
      
      // ✅ 2. Updated to check for error.response?.data?.error to match backend structure
      toast.error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold">Checkout</h1>
          <p className="mt-3 text-gray-500">Complete your order securely.</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {/* Billing Details */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow">
              <h2 className="mb-8 text-2xl font-bold">Billing Details</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={checkoutData.fullName}
                  onChange={handleInputChange}
                  className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={checkoutData.email}
                  onChange={handleInputChange}
                  className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={checkoutData.phone}
                  onChange={handleInputChange}
                  className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={checkoutData.city}
                  onChange={handleInputChange}
                  className="rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />
              </div>

              <textarea
                rows="5"
                name="address"
                placeholder="Complete Address"
                value={checkoutData.address}
                onChange={handleInputChange}
                className="mt-6 w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={checkoutData.pincode}
                onChange={handleInputChange}
                className="mt-6 w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
              />

              <h3 className="mt-10 text-xl font-bold">Payment Method</h3>
              <div className="mt-5 space-y-4">
                <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={checkoutData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="upi"
                    checked={checkoutData.paymentMethod === "upi"}
                    onChange={handleInputChange}
                  />
                  UPI Payment
                </label>
                <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={checkoutData.paymentMethod === "card"}
                    onChange={handleInputChange}
                  />
                  Credit / Debit Card
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-3xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="mt-8 space-y-5">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                          {item.selectedColor && item.selectedSize && " | "}
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity || 1}</p>
                    </div>
                    {/* Safe fallback for line item display as well */}
                    <span className="font-medium">
                      ₹{Number(item.price || item.price_at_time || 0) * (item.quantity || 1)}
                    </span>
                  </div>
                ))}

                <hr className="border-gray-100" />

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

              <div className="mt-8">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#C9A227]"
                />
                <button className="mt-4 w-full rounded-xl border border-[#C9A227] py-3 font-semibold text-[#C9A227] transition hover:bg-[#C9A227] hover:text-white">
                  Apply Coupon
                </button>
              </div>

              <LoadingButton
                loading={loading}
                onClick={handlePlaceOrder}
                className="mt-8 w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227]"
              >
                Place Order
              </LoadingButton>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Checkout;