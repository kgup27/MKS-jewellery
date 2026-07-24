import axiosInstance from "./axiosInstance";

const productService = {
  // Get All Products
  getAllProducts: async (params = {}) => {
    const response = await axiosInstance.get("/api/products", {
      params,
    });

    return response.data;
  },

  // Get Product By ID
  getProductById: async (id) => {
    const response = await axiosInstance.get(
      `/products/${id}`
    );

    return response.data;
  },

  // Create Product
  createProduct: async (productData) => {
    const response = await axiosInstance.post(
      "/products",
      productData
    );

    return response.data;
  },

  // Update Product
  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(
      `/products/${id}`,
      productData
    );

    return response.data;
  },

  // Delete Product
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(
      `/products/${id}`
    );

    return response.data;
  },

  // Search Products
  searchProducts: async (keyword) => {
    const response = await axiosInstance.get(
      "/products/search",
      {
        params: {
          keyword,
        },
      }
    );

    return response.data;
  },

  // Filter Products
  filterProducts: async (filters) => {
    const response = await axiosInstance.get(
      "/products/filter",
      {
        params: filters,
      }
    );

    return response.data;
  },
};

export default productService;