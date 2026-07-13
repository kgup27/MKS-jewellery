import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import {
  FaPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

import CategoryTable from "../../components/CategoryTable/CategoryTable";
import CategoryModal from "../../components/CategoryModal/CategoryModal";
import ViewCategoryModal from "../../components/ViewCategoryModal/ViewCategoryModal";
import DeleteCategoryModal from "../../components/DeleteCategoryModal/DeleteCategoryModal";
import Pagination from "../../components/Pagination/Pagination";

function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // Added Filter Logic (Step 4)
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      category.slug
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "" || category.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="mt-2 text-gray-500">
            Manage jewellery categories and featured collections.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b08d1f]"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          
          {/* Controlled Search Input (Step 5) */}
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* Controlled Status Select (Step 6) */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#C9A227]"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Clear Filters Button (Step 7) */}
          <button
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 hover:bg-gray-50"
          >
            <FaFilter />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <CategoryTable
        categories={filteredCategories}
        loading={loading}
        onView={(category) => {
          setSelectedCategory(category);
          setViewOpen(true);
       }}
        onEdit={(category) => {
          setSelectedCategory(category);
          setModalOpen(true);
       }}
        onDelete={(category) => {
          setSelectedCategory(category);
          setDeleteOpen(true);
        }}
      />

      <Pagination />

      {/* Add / Edit */}
      <CategoryModal
        open={modalOpen}
        category={selectedCategory}
        onClose={() => {
          setModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={async () => {
          await fetchCategories();

          setModalOpen(false);
          setSelectedCategory(null);
        }}
      />

      {/* View */}
      <ViewCategoryModal
        open={viewOpen}
        category={selectedCategory}
        onClose={() => {
          setViewOpen(false);
          setSelectedCategory(null);
        }}
      />

      {/* Delete */}
      <DeleteCategoryModal
        open={deleteOpen}
        category={selectedCategory}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedCategory(null);
        }}
        onDelete={(category) => {
          console.log("Delete:", category);
          setDeleteOpen(false);
          setSelectedCategory(null);
        }}
      />

    </div>
  );
}

export default Categories;