import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../User/userSlice.js";
import axios from "axios";

// 🔥 Helper function
const calculateTotal = (cartItems) => {
  return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// cartSlice.js
export const addToCartAPI = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/cart", {
        productId,
        quantity,
      })
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const updateCartAPI = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/api/v1/cart", {
        productId,
        quantity,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const removeCartAPI = createAsyncThunk(
  "cart/removeCart",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/cart/${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const clearCartAPI = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("/api/v1/cart"); // 👈 endpoint
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalAmount: 0, // ✅ initial total
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
    loading: false,
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
    orderCompleted: (state) => {
      state.shippingInfo = {};
      state.cartItems = [];
      state.totalAmount = 0;
      sessionStorage.removeItem("orderInfo");

      localStorage.removeItem("shippingInfo");
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems;
      state.totalAmount = calculateTotal(state.cartItems);
      state.loading = false;
    });
    builder.addCase(getCart.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(addToCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems;
      state.totalAmount = calculateTotal(state.cartItems);
      state.loading = false;
    });
    builder.addCase(addToCartAPI.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCartAPI.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems;
      state.loading = false;
      state.totalAmount = calculateTotal(state.cartItems);
    });
    builder.addCase(updateCartAPI.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(removeCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeCartAPI.fulfilled, (state, action) => {
      state.cartItems = action.payload.cartItems;
      state.loading = false;
      state.totalAmount = calculateTotal(state.cartItems);
    });
    builder.addCase(removeCartAPI.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(clearCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clearCartAPI.fulfilled, (state, action) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.loading = false;
    });
    builder.addCase(clearCartAPI.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.loading = false;
      //clear all local storage and session storage
      localStorage.removeItem("shippingInfo");
      localStorage.removeItem("cartItems");
      sessionStorage.removeItem("orderInfo");
    });
  },
});

export const { clearCart, saveShippingInfo, orderCompleted } =
  cartSlice.actions;

export default cartSlice.reducer;
