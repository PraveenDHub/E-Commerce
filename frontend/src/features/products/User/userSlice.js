import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../../api/api";

//register
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/v1/register", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed!");
    }
  },
);

//get profile
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/v1/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load user!");
    }
  },
);

//login
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/api/v1/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed!");
    }
  },
);

//logout
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/v1/logout");
      localStorage.clear();
      sessionStorage.clear();
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data || "Logout failed!");
    }
  },
);

//updateProfile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.put("/api/v1/profile/update", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update profile failed!");
    }
  },
);

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await API.post(
        "/api/v1/password/forget",
        { email },
        { headers: { "Content-Type": "application/json" } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Forget password failed!");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/v1/reset/${token}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Reset password failed!");
    }
  },
);

// ─── Admin thunks ─────────────────────────────────────────────────────────────

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/api/v1/admin/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load users!");
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/api/v1/admin/user/${id}`,
        { role },
        { headers: { "Content-Type": "application/json" } },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update user role!",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/api/v1/admin/user/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user!");
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    loading: false,
    usersLoading: false, // ✅ separate loading for admin users list
    users: [], // admin list — never mix with `user`
    error: null,
    success: false,
    message: null,
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
      state.message = null;
    },
    removeSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // ── register ──────────────────────────────────────────────────
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        state.user = action.payload?.user;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed!";
        state.success = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })

    // ── loadUser ──────────────────────────────────────────────────
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user!";
        state.user = null;
        state.isAuthenticated = false;
        if (action.payload?.message === "User not found!") {
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      })

    // ── login ─────────────────────────────────────────────────────
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
        if (action.payload?.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed!";
        state.success = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })

    // ── logout ────────────────────────────────────────────────────
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.users = [];
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed!";
      })

    // ── updateProfile ─────────────────────────────────────────────
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update profile failed!";
        state.success = false;
      })

    // ── forgetPassword ────────────────────────────────────────────
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Forget password failed!";
        state.success = false;
      })

    // ── resetPassword ─────────────────────────────────────────────
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Reset password failed!";
        state.success = false;
      })

    // ── getAllUsers (admin) ────────────────────────────────────────
    // ✅ Only touches state.users — never state.user
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.users = action.payload?.users || [];
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload?.message || "Failed to load users!";
        state.users = [];
      })

    // ── updateUserRole (admin) ────────────────────────────────────
    // ✅ Only updates the target user inside state.users list
    // ✅ Never touches state.user (logged-in admin session)
      .addCase(updateUserRole.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        // Update the specific user in the list if backend returns updated user
        if (action.payload?.user) {
          state.users = state.users.map((u) =>
            u._id === action.payload.user._id ? action.payload.user : u,
          );
        }
        // ✅ Do NOT touch state.user or localStorage here
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload?.message || "Failed to update user role!";
        state.success = false;
        // ✅ Do NOT touch state.user here
      })

    // ── deleteUser (admin) ────────────────────────────────────────
    // ✅ Only removes user from state.users list
    // ✅ Never touches state.user or localStorage (that would log the admin out!)
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.error = null;
        state.message = action.payload?.message;
        state.success = action.payload?.success;
        // ✅ Do NOT touch state.user or localStorage here
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload?.message || "Failed to delete user!";
        state.success = false;
        // ✅ Do NOT touch state.user here
      });
  },
});

export const { removeError, removeSuccess } = userSlice.actions;
export default userSlice.reducer;