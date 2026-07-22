import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import api from "../../../services/api";
import toast from "react-hot-toast";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/orders/${id}`);

      setOrder(response.data.order);
      setItems(response.data.items);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // 👈 Step 2: Added handleCancelOrder function below fetchOrder
  const handleCancelOrder = async () => {
    // Optional: User se confirmation lene ke liye safe check
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await api.patch(`/api/orders/${id}/cancel`);
      toast.success(response.data.message || "Order cancelled successfully!");
      fetchOrder(); // Refetch data taaki UI par status automatic update ho jaye
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to cancel order."
      );
    }
  };

  // Helper 1: Calculate total for individual item safely
  const getItemTotal = (item) => 
    Number(item.quantity) * Number(item.price_at_purchase || 0);

  // Helper 2: Premium Indian Currency Formatter with Comma Separation
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount || 0));

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <div className="text-[#C9A227] text-xl font-semibold animate-pulse">
            Loading Order...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <div className="text-gray-500 text-xl font-semibold">
            Order not found.
          </div>
        </div>
      </MainLayout>
    );
  }

  // Safe Case Normalization for backend data mismatch prevention
  const orderStatus = order.status?.toLowerCase();
  const paymentStatus = order.payment_status?.toLowerCase();

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="max-w-6xl mx-auto px-6">

          <Link
            to="/orders"
            className="text-[#C9A227] font-medium transition-colors hover:text-[#b08e22]"
          >
            ← Back to Orders
          </Link>

          <div className="mt-6 rounded-3xl bg-white shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Order #MK{String(order.order_id).padStart(6, "0")}
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  {new Date(order.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              {/* 👈 Step 1: Status Section with Conditional Cancel Button */}
              <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end">
                <p className="font-semibold text-gray-700">Status</p>
                
                <span
                  className={`inline-block mt-2 rounded-full px-4 py-2 font-semibold capitalize text-sm ${
                    orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : orderStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : orderStatus === "processing"
                      ? "bg-blue-100 text-blue-700"
                      : orderStatus === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>

                {/* Conditional rendering for Cancel Button */}
                {orderStatus !== "delivered" && orderStatus !== "cancelled" && (
                  <button
                    onClick={handleCancelOrder}
                    className="mt-4 rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 shadow-sm"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            <div className="space-y-6">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                  No products found.
                </p>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.order_item_id || `${item.product_id}-${index}`}
                    className="flex items-center gap-6 border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={
                        item.image_url?.trim()
                          ? item.image_url
                          : "https://placehold.co/300x300?text=MK+Jewellers"
                      }
                      alt={item.title}
                      className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/300x300?text=MK+Jewellers";
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-500 mt-1 text-sm">Quantity : {item.quantity}</p>
                      <p className="text-gray-500 text-sm">
                        Price : {formatCurrency(item.price_at_purchase)}
                      </p>
                    </div>

                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(getItemTotal(item))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-white shadow-sm p-8">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-700">
                <span>Total Amount</span>
                <span className="font-bold text-xl text-gray-900">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Payment Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : paymentStatus === "failed"
                      ? "bg-red-100 text-red-700"
                      : paymentStatus === "refunded"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Order Status</span>
                <span className="capitalize font-medium">{order.status}</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default OrderDetails;