import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import api from "../../../services/api";
import toast from "react-hot-toast";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="max-w-7xl mx-auto px-6">

          <h1 className="text-5xl font-bold">
            My Orders
          </h1>

          <p className="mt-3 text-gray-500">
            Track all your jewellery orders.
          </p>

          <div className="mt-12 space-y-6">

            {orders.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 shadow text-center">
                No Orders Found
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.order_id}
                  className="rounded-3xl bg-white p-8 shadow"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                      <h2 className="text-2xl font-bold">
                        Order #MK{String(order.order_id).padStart(6, "0")}
                      </h2>

                      <p className="mt-2 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₹{order.total_amount}
                      </p>

                      <Link
                        to={`/orders/${order.order_id}`}
                        className="mt-3 inline-block rounded-xl border border-[#C9A227] px-6 py-2 transition hover:bg-[#C9A227] hover:text-white"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </div>
              ))
            )}

          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default MyOrders;