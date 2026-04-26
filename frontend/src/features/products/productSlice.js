import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (
    { keyword = "", page = 1, category = "" } = {},
    { rejectWithValue },
  ) => {
    try {
      let link = `/api/v1/products?page=${page}`;
      if (keyword) {
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }
      if (category) {
        link += `&category=${encodeURIComponent(category)}`;
      }
      const { data } = await API.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/product/${id}`;
      const { data } = await API.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

export const createReview = createAsyncThunk(
  "product/createReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const link = `/api/v1/review`;
      const { data } = await API.put(link, { productId, rating, comment }, {
        withCredentials: true
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

// 🔥 GET ALL PRODUCTS (ADMIN)
export const getAdminProducts = createAsyncThunk(
  "product/getAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

// 🔥 CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async ({formData}, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        "/api/v1/admin/product/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Create failed");
    }
  },
);

// 🔥 UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/api/v1/admin/product/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  },
);

// 🔥 DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/api/v1/admin/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

//create slice
const productSlice = createSlice({
  name: "product",
  //state variable
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resPerPage: 4,
    totalPages: 0,
    success: false,
    message: null,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resPerPage = action.payload.resPerPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.productCount = 0;
        state.error = action.payload?.message || "Something went wrong";
      })
      // 🔥 SINGLE PRODUCT
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // 🔥 CREATE REVIEW
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload?.message;
        state.product = action.payload.product;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // ADMIN GET
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products;
      })

      // CREATE (optimistic)
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message;
        state.products.unshift(action.payload?.product); // 🚀 add instantly
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // UPDATE (optimistic)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload?.message;

        const index = state.products.findIndex(
          (p) => p._id === action.payload?.product?._id,
        );
        if (index !== -1) {
          state.products[index] = action.payload?.product;
        }
      })

      // DELETE (optimistic)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.success = true;
        state.message = action.payload?.message;

        state.products = state.products.filter(
          (p) => p._id !== action.payload?.id,
        );
      });
  },
});

export const { removeError, clearSuccess } = productSlice.actions;
export default productSlice.reducer;
