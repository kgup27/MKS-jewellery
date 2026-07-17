import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"; // Removed FaFilter as requested
import toast from "react-hot-toast";

import adminApi from "../../../services/adminApi";

import UsersTable from "../../components/UsersTable/UsersTable";
import Pagination from "../../components/Pagination/Pagination";
import UserDetailsModal from "../../components/UserDetailsModal/UserDetailsModal";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import DeleteUserModal from "../../components/DeleteUserModal/DeleteUserModal";

function Users() {
  const [selectedUser, setSelectedUser] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Real customer data
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Pagination Configuration
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/admin/customers");
      console.log("Customers API Data:", res.data);
      setCustomers(res.data);
      setCurrentPage(1); // Data refresh hone par wapas page 1 par lane ke liye
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      toast.error(
        err.response?.data?.error || "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      customer.name?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All Status" ||
      customer.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination Calculations based on filtered data
  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  
  // Current page ke liye slice kiya hua filtered data
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Update customer API handler
  const handleEditSave = async (updatedUser) => {
    try {
      const res = await adminApi.put(
        `/api/admin/customers/${updatedUser.id}`,
        {
          name: updatedUser.name,
          email: updatedUser.email,
          status: updatedUser.status,
        }
      );

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === updatedUser.id
            ? { ...customer, ...res.data }
            : customer
        )
      );

      toast.success("Customer updated successfully");
      setEditOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to update customer:", err);
      toast.error(
        err.response?.data?.error || "Failed to update customer"
      );
    }
  };

  // Delete customer API handler
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await adminApi.delete(
        `/api/admin/customers/${selectedUser.id}`
      );

      setCustomers((prev) =>
        prev.filter(
          (customer) => customer.id !== selectedUser.id
        )
      );

      // Agar last page ka akela bacha hua item delete ho jaye, toh auto-previous page par jump karega
      if (currentCustomers.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.success("Customer deleted successfully");
      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete customer:", err);
      toast.error(
        err.response?.data?.error || "Failed to delete customer"
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Customers
          </h1>
          <p className="mt-2 text-gray-500">
            Manage all registered customers.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

          {/* Search */}
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Filter badalne par reset to page 1
              }}
              placeholder="Search by name, email or phone..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Status Select */}
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Filter badalne par reset to page 1
            }}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="VIP">VIP</option>
            <option value="Blocked">Blocked</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All Status");
              setCurrentPage(1);
            }}
            disabled={searchTerm === "" && statusFilter === "All Status"}
            className="flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Filters
          </button>

        </div>
      </div>

      {/* Table */}
      <UsersTable
        customers={currentCustomers}
        loading={loading}
        onView={(user) => {
          setSelectedUser(user);
          setViewOpen(true);
        }}
        onEdit={(user) => {
          setSelectedUser(user);
          setEditOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setDeleteOpen(true);
        }}
      />

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalProducts={totalCustomers}
        productsPerPage={customersPerPage}
        label="customers"
      />

      {/* View Modal */}
      <UserDetailsModal
        open={viewOpen}
        user={selectedUser}
        onClose={() => {
          setViewOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Edit Modal */}
      <EditUserModal
        open={editOpen}
        user={selectedUser}
        onClose={() => {
          setEditOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleEditSave}
      />

      {/* Delete Modal */}
      
      <DeleteUserModal
        open={deleteOpen}
        user={selectedUser}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedUser(null);
        }}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default Users;