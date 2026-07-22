import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBoxes, FaSearch, FaFilter } from "react-icons/fa";

import adminApi from "../../../services/adminApi";

import InventoryTable from "../../components/InventoryTable/InventoryTable";
import LowStockAlert from "../../components/LowStockAlert/LowStockAlert";
import StockDetailsModal from "../../components/StockDetailsModal/StockDetailsModal";
import UpdateStockModal from "../../components/UpdateStockModal/UpdateStockModal";
import StockHistoryModal from "../../components/StockHistoryModal/StockHistoryModal";
import Pagination from "../../components/Pagination/Pagination";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Step 1: Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Fetch Inventory Data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/admin/inventory");
      console.log(res.data);
      setInventory(res.data);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error || "Failed to load inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Stock Update API Call (Updated with reason & supplierNote)
  const handleUpdateStock = async (updatedItem) => {
    try {
      await adminApi.put(
        `/api/admin/inventory/${updatedItem.product_id}`,
        {
          action: updatedItem.operation,
          quantity: Number(updatedItem.quantity),
          reason: updatedItem.reason,
          supplierNote: updatedItem.supplierNote,
        }
      );

      toast.success("Stock updated successfully");

      await fetchInventory();

      setUpdateOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error || "Failed to update stock"
      );
    }
  };

  // Filter inventory based on search term and status
  const filteredInventory = inventory.filter((item) => {
    const search = searchTerm.toLowerCase();

    const title = String(item.title ?? "").toLowerCase();
    const category = String(item.category_name ?? "").toLowerCase();
    const brand = String(item.brand ?? "").toLowerCase();
    const status = String(item.status ?? "");

    const matchesSearch =
      title.includes(search) ||
      category.includes(search) ||
      brand.includes(search);

    const matchesStatus =
      statusFilter === "All Status"
        ? true
        : statusFilter === "Low Stock"
        ? status === "Low Stock" || status === "Out of Stock"
        : status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Step 2: Pagination Calculations
  const totalProducts = filteredInventory.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentInventory = filteredInventory.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    fetchInventory();
  }, []);

  // Reset page to 1 whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <FaBoxes className="text-[#C9A227]" />
            Inventory
          </h1>
          <p className="mt-2 text-gray-500">
            Manage inventory, stock levels and supplier updates.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Status Filter Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
          >
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All Status");
              setCurrentPage(1);
            }}
            disabled={
              searchTerm === "" &&
              statusFilter === "All Status"
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      <LowStockAlert
        inventory={inventory}
        isViewingAllLowStock={statusFilter === "Low Stock"}
        onViewAll={() => {
          setSearchTerm("");        // Search clear
          setCurrentPage(1);        // First page
          setStatusFilter("Low Stock");

          document
            .getElementById("inventory-table")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }}
      />

      {/* Step 3: Inventory Table */}
      <div id="inventory-table">
        <InventoryTable
          inventory={currentInventory}
          loading={loading}
          onView={(item) => {
            setSelectedItem(item);
            setViewOpen(true);
          }}
          onUpdate={(item) => {
            setSelectedItem(item);
            setUpdateOpen(true);
          }}
          onHistory={(item) => {
            setSelectedItem(item);
            setHistoryOpen(true);
          }}
        />
      </div>

      {/* Step 4: Pagination component with props */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalProducts={totalProducts}
        productsPerPage={productsPerPage}
        label="products"
      />

      {/* View Modal */}
      <StockDetailsModal
        open={viewOpen}
        item={selectedItem}
        onClose={() => {
          setViewOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Update Modal */}
      <UpdateStockModal
        open={updateOpen}
        item={selectedItem}
        onClose={() => {
          setUpdateOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleUpdateStock}
      />

      {/* History Modal */}
      <StockHistoryModal
        open={historyOpen}
        item={selectedItem}
        onClose={() => {
          setHistoryOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default Inventory;