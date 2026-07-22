import { useState, useEffect } from "react";

import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import adminApi from "../../../services/adminApi";

import OrdersTable from "../../components/OrdersTable/OrdersTable";
import Pagination from "../../components/Pagination/Pagination";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";
import UpdateStatusModal from "../../components/UpdateStatusModal/UpdateStatusModal";
import InvoiceModal from "../../components/InvoiceModal/InvoiceModal";

function Orders() {
  // Modals and Selection States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Data, Loading & Pagination States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Fetch All Orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // 1. FIXED: Fetch Specific Order Details (Destructuring Backend Payload)
  const fetchOrderDetails = async (id, targetModal = "details") => {
    try {
      const response = await adminApi.get(`/api/admin/orders/${id}`);
      
      // Destructuring order and items correctly as per backend response
      const fullyDetailedOrder = {
        ...response.data,
        items: response.data.items || [],
      };
      console.log(fullyDetailedOrder);
      setSelectedOrder(fullyDetailedOrder);
      
      // Open modal
    if (targetModal === "invoice") {    
      setInvoiceOpen(true);
    } else if (targetModal === "status") {
      setStatusOpen(true);
    } else {
      setDetailsOpen(true);
    }

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to load order details"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search and Status Filter Logic
  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      order.customer_name?.toLowerCase().includes(keyword) ||
      order.customer_email?.toLowerCase().includes(keyword) ||
      String(order.order_id || order.id).includes(keyword);
      
    const matchStatus =
      statusFilter === "" || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Pagination Logic
  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalOrders / ordersPerPage)
  );
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-gray-500">
            Manage customer orders and monitor delivery status.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
     
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Clear Filter button */}
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-300 px-5 py-3 hover:bg-gray-50 text-gray-600 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={paginatedOrders}
        loading={loading}
        onView={(order) => {
          fetchOrderDetails(order.order_id || order.id, "details");
        }}
        onStatus={(order) => {
          fetchOrderDetails(order.order_id || order.id, "status");
        }}
        // Passed action for Invoice Trigger
        onInvoice={(order) => {
          fetchOrderDetails(order.order_id || order.id, "invoice");
        }}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalProducts={totalOrders}
        productsPerPage={ordersPerPage}
      />

      {/* Details Modal */}
      <OrderDetailsModal
        open={detailsOpen}
        order={selectedOrder}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedOrder(null);
        }}
      />

      {/* Status Modal */}
      <UpdateStatusModal
        open={statusOpen}
        order={selectedOrder}
        onClose={() => {
          setStatusOpen(false);
          setSelectedOrder(null);
        }}
        onSave={async (updatedOrder) => {
          try {
            const orderId = updatedOrder.order_id || updatedOrder.id;
            
            // 2. FIXED: Correct status update endpoint matching backend
            await adminApi.put(
              `/api/admin/orders/${orderId}`,
              {
                status: updatedOrder.status,
              }
            );

            toast.success("Order status updated successfully");
            await fetchOrders();

            setStatusOpen(false);
            setSelectedOrder(null);
          } catch (error) {
            console.error(error);
            toast.error(
              error.response?.data?.error || "Failed to update status"
            );
          }
        }}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        open={invoiceOpen}
        order={selectedOrder}
        onClose={() => {
          setInvoiceOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}

export default Orders;