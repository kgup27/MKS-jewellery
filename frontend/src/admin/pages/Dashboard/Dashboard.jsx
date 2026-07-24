import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPackage,
} from "react-icons/fi";

import DashboardCard from "../../components/DashboardCard/DashboardCard";
import SalesChart from "../../components/SalesChart/SalesChart";
import RecentOrders from "../../components/RecentOrders/RecentOrders";
import TopProducts from "../../components/TopProducts/TopProducts";
import LowStock from "../../components/LowStock/LowStock";
import RecentActivity from "../../components/RecentActivity/RecentActivity";

import adminApi from "../../../services/adminApi";

function Dashboard() {
  // ✅ Change 1: Added recentActivity to initial state
  const [dashboard, setDashboard] = useState({
    stats: {
      revenue: 0,
      orders: 0,
      customers: 0,
      products: 0,
    },
    recentOrders: [],
    topProducts: [],
    lowStock: [],
    salesOverview: [],
    recentActivity: [], 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.get("/api/admin/dashboard");
      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-500">
            Welcome back, Admin 👋 Here's an overview of your jewellery store.
          </p>
        </div>

        <div className="rounded-xl bg-white px-5 py-3 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Today's Date</p>
          <h3 className="font-semibold text-gray-800">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Revenue"
          value={`₹${dashboard.stats.revenue.toLocaleString()}`}
          change="+0%"
          icon={FiDollarSign}
          color="yellow"
        />
        <DashboardCard
          title="Orders"
          value={dashboard.stats.orders}
          change="+0%"
          icon={FiShoppingBag}
          color="blue"
        />
        <DashboardCard
          title="Customers"
          value={dashboard.stats.customers}
          change="+0%"
          icon={FiUsers}
          color="purple"
        />
        <DashboardCard
          title="Products"
          value={dashboard.stats.products}
          change="+0%"
          icon={FiPackage}
          color="green"
        />
      </div>

      {/* Sales Chart + Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart data={dashboard.salesOverview} />
        </div>
        {/* ✅ Change 2: Passed activities prop to RecentActivity */}
        <RecentActivity activities={dashboard.recentActivity} />
      </div>

      {/* Orders + Products */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentOrders orders={dashboard.recentOrders} />
        <TopProducts products={dashboard.topProducts} />
      </div>

      {/* Low Stock */}
      <LowStock products={dashboard.lowStock} />
    </div>
  );
}

export default Dashboard;