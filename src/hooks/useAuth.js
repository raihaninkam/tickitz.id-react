import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

export const useAuth = () => {
  const [registeredUsers, setRegisteredUsers] = useLocalStorage(
    "registeredUsers",
    []
  );
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);

  const registerUser = (userData) => {
    try {
      // Check if email already exists
      const emailExists = registeredUsers.some(
        (user) => user.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (emailExists) {
        return {
          success: false,
          message: "Email sudah terdaftar. Gunakan email lain.",
        };
      }

      const newUser = {
        id: Date.now(),
        email: userData.email.trim(),
        password: userData.password,
        registeredAt: new Date().toISOString(),
        isActive: true,
      };

      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);

      return {
        success: true,
        message: "Registrasi berhasil!",
        user: newUser,
      };
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat registrasi.",
      };
    }
  };

  const loginUser = (email, password) => {
    try {
      if (registeredUsers.length === 0) {
        return {
          success: false,
          message: "User Not Found.",
        };
      }

      const foundUser = registeredUsers.find(
        (user) => user.email && user.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        return {
          success: false,
          message: "Invalid Email or Password.",
        };
      }

      if (foundUser.password !== password) {
        return {
          success: false,
          message: "Invalid Email or Password.",
        };
      }

      // Save user session
      const sessionData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name || foundUser.fullName || "",
        loginTime: new Date().toISOString(),
      };

      setCurrentUser(sessionData);

      return {
        success: true,
        user: foundUser,
        message: "Login berhasil!",
      };
    } catch (error) {
      console.error("Error during login:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat login.",
      };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  return {
    registeredUsers,
    currentUser,
    registerUser,
    loginUser,
    logoutUser,
    isAuthenticated,
  };
};

export function useRoleBasedRedirect() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (token && user?.role) {
      if (user.role === "admin") {
        navigate("/movieList", { replace: true });
      } else if (user.role === "user") {
        navigate("/dashboard", { replace: true }); // atau halaman default user
      }
    }
  }, [token, user, navigate]);
}

// Hook untuk mendapatkan status auth
export function useAuthStatus() {
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  return {
    token,
    user,
    isAuthenticated,
    userRole: user?.role,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
}

// Hook untuk cek apakah user punya akses ke route tertentu
export function useRouteAccess(requiredRoles = []) {
  const { userRole } = useAuthStatus();

  if (requiredRoles.length === 0) {
    return true; // Jika tidak ada role requirement, izinkan akses
  }

  return requiredRoles.includes(userRole);
}

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const { token } = getState().auth;

    try {
      // Kirim request ke backend untuk logout
      const response = await axios.post(
        `${import.meta.env.VITE_BE_HOST}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      // Even if the backend request fails, we still want to clear the local state
      console.error("Logout error:", error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = null;
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Even if the backend request fails, we still clear the local state
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
      });
  },
});

export const { setCredentials, clearCredentials, setError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
//
