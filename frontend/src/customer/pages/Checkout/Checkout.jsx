import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import MainLayout from "../../layouts/MainLayout";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import toast from "react-hot-toast";
import api from "../../../services/api";

function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useCustomerAuth();

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Fetch addresses on mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view checkout.");
      navigate("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await api.get("/api/addresses");
        setAddresses(res.data || []);

        // Find default address if available
        const defaultAddress = res.data?.find((a) => a.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.address_id);
        } else if (res.data?.length > 0) {
          // Fallback to first address if no default is set
          setSelectedAddress(res.data[0].address_id);
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
        toast.error("Failed to load saved addresses.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, navigate]);

  // Safe Subtotal Calculation
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

    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/orders", {
        address_id: selectedAddress,
        paymentMethod,
      });

      toast.success(response.data.message || "Order placed successfully!");
      
      if (clearCart) {
        clearCart();
      }
      
      navigate("/order-success", {
        state: {
          orderId: response.data.orderId,
        },
      });
    } catch (error) {
      console.error("Order processing failed:", error);
      toast.error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <p className="text-xl font-medium text-gray-600">Loading checkout details...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold">Checkout</h1>
          <p className="mt-3 text-gray-500">Complete your order securely.</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {/* Left Side: Address & Payment */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Address Selection Block */}
              <div className="rounded-3xl bg-white p-8 shadow">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Choose Delivery Address</h2>
                  <Link 
                    to="/saved-address" 
                    className="text-sm font-semibold text-[#C9A227] hover:underline"
                  >
                    + Add New Address
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-500 mb-4">No saved addresses found.</p>
                    <Link
                      to="/saved-address"
                      className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-[#C9A227] transition"
                    >
                      Add Address to Continue
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.address_id}
                        onClick={() => setSelectedAddress(address.address_id)}
                        className={`flex gap-4 cursor-pointer rounded-xl border p-5 transition items-start ${
                          selectedAddress === address.address_id
                            ? "border-[#C9A227] bg-yellow-50/40"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddress === address.address_id}
                          onChange={() => setSelectedAddress(address.address_id)}
                          className="mt-1 accent-[#C9A227]"
                        />
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p className="font-semibold text-gray-900 text-base mb-1">
                            {address.full_name}
                          </p>
                          <p>{address.address_line1}</p>
                          {address.address_line2 && <p>{address.address_line2}</p>}
                          <p>
                            {address.city}, {address.state} - <span className="font-medium text-gray-800">{address.pincode}</span>
                          </p>
                          <p className="pt-1 text-xs text-gray-500">Phone: {address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Block */}
              <div className="rounded-3xl bg-white p-8 shadow">
                <h3 className="text-2xl font-bold mb-6">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C9A227]"
                    />
                    <span className="font-medium text-gray-800">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C9A227]"
                    />
                    <span className="font-medium text-gray-800">UPI Payment</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#C9A227]"
                    />
                    <span className="font-medium text-gray-800">Credit / Debit Card</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Side: Order Summary */}
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
                    <span className="font-medium text-gray-800">
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
                disabled={addresses.length === 0}
                onClick={handlePlaceOrder}
                className="mt-8 w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-[#C9A227] disabled:bg-gray-300 disabled:cursor-not-allowed"
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