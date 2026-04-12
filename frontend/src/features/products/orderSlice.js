import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getMyOrders = createAsyncThunk(
  "order/myOrders",
  async (_, {rejectWithValue}) => {
    try {
      const { data } = await axios.get("/api/v1/orders/user");
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/details",
  async (id) => {
    const { data } = await axios.get(`/api/v1/order/${id}`);
    return data.order;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;