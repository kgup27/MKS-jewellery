import React from "react";
import { Link } from "react-router-dom";

function RecentOrders({
  orders = [],
  viewAllPath = "/admin/orders",

}) {

  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <p className="text-sm text-gray-500">Latest customer orders</p>
        </div>

        <Link
          to={viewAllPath}
          className="rounded-lg border border-[#C9A227] px-4 py-2 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-white"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="py-3 text-left text-sm font-semibold">Customer</th>
              <th className="py-3 text-left text-sm font-semibold">Product</th>
              <th className="py-3 text-left text-sm font-semibold">Amount</th>
              <th className="py-3 text-left text-sm font-semibold">Status</th>
              <th className="py-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const orderDate = order.created_at ? new Date(order.created_at) : null;
                const isValidDate = orderDate && !isNaN(orderDate.getTime());

                return (
                  <tr
                    key={order.order_id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    <td className="py-4 font-medium">#{order.order_id}</td>
                    <td className="py-4">{order.customer_name || "Guest"}</td>
                    <td className="py-4">{order.product_name || "—"}</td>
                    <td className="py-4 font-semibold">
                      ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4">
                      <span
                       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        {order.status
                          ? order.status.charAt(0).toUpperCase() +
                            order.status.slice(1).toLowerCase()
                          : "—"}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">
                      {isValidDate
                        ? orderDate.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;