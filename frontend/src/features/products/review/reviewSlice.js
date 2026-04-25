import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../api/api";

// GET all reviews across all products (admin)
// matches: GET /api/v1/admin/reviews
export const getAllReviews = createAsyncThunk(
  "review/getAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/v1/admin/reviews");
      return response.data; // { success, reviews: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load reviews!");
    }
  },
);

// DELETE a single review (admin)
// matches: DELETE /api/v1/admin/review?productId=...&reviewId=...
export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const response = await API.delete(
        `/api/v1/admin/review?productId=${productId}&reviewId=${reviewId}`,
      );
      return response.data; // { success, message }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete review!",
      );
    }
  },
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearReviewSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // ── getAllReviews ──────────────────────────────────────────────
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Backend may return { reviews } or { data } depending on your API
        state.reviews = action.payload?.reviews || action.payload?.data || [];
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load reviews!";
        state.reviews = [];
      })

      // ── deleteReview ──────────────────────────────────────────────
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        // ✅ Do NOT touch state.reviews here — AdminReviews re-fetches after delete
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete review!";
        state.success = false;
      });
  },
});

export const { clearReviewError, clearReviewSuccess } = reviewSlice.actions;
export default reviewSlice.reducer;
