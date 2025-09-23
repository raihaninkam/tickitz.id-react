import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  role: null,
};

// Async thunk untuk fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (!token) {
        throw new Error("No token available");
      }

      const response = await fetch(`${import.meta.env.VITE_BE_HOST}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      return data.data; // Return profile data dari API response
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      // Reducer untuk update user data setelah edit profile
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.ID,
          email: action.payload.email,
          role: action.payload.role,
          poin: action.payload.poin,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          phone_number: action.payload.phone_number,
          profile_picture: action.payload.profile_picture,
        };
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Failed to fetch profile:", action.payload);
      });
  },
});

export const { setCredentials, logout, updateUser, clearError } =
  authSlice.actions;
export default authSlice.reducer;
