import axiosInstance from "./axiosInstance";

const categoryService = {
  // ==========================
  // Get All Categories
  // ==========================
  getAllCategories: async (params = {}) => {
    const response = await axiosInstance.get("/api/categories", {
      params,
    });

    return response.data;
  },

  // ==========================
  // Get Category By ID
  // ==========================
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(
      `/categories/${id}`
    );

    return response.data;
  },

  // ==========================
  // Create Category
  // ==========================
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post(
      "/categories",
      categoryData
    );

    return response.data;
  },

  // ==========================
  // Update Category
  // ==========================
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(
      `/categories/${id}`,
      categoryData
    );

    return response.data;
  },

  // ==========================
  // Update Category Status
  // ==========================
  updateCategoryStatus: async (id, status) => {
    const response = await axiosInstance.patch(
      `/categories/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },

  // ==========================
  // Delete Category
  // ==========================
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(
      `/categories/${id}`
    );

    return response.data;
  },

  // ==========================
  // Search Categories
  // ==========================
  searchCategories: async (keyword) => {
    const response = await axiosInstance.get(
      "/categories/search",
      {
        params: {
          keyword,
        },
      }
    );

    return response.data;
  },

  // ==========================
  // Filter Categories
  // ==========================
  filterCategories: async (filters) => {
    const response = await axiosInstance.get(
      "/categories/filter",
      {
        params: filters,
      }
    );

    return response.data;
  },
};

export default categoryService;