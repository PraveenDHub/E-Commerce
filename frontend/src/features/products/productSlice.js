import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async ({ keyword = "", page = 1,category = "" } = {}, { rejectWithValue }) => {
    try {
      // const link = keyword
      //   ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`
      //   : `/api/v1/products?page=${page}`;
      let link = `/api/v1/products?page=${page}`;
      if(keyword){
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }
      if(category){
        link += `&category=${encodeURIComponent(category)}`;
      }
      const { data } = await axios.get(link);
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
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
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
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
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
      });
  },
});

export const { removeError } = productSlice.actions;
export default productSlice.reducer;
