import Login from "./components/Login.jsx";
import MovieApp from "./pages/Movie.jsx";
import Register from "./components/Register.jsx";
import Home from "./pages/Home.jsx";
import PaymentPage from "./pages/Payment.jsx";
import OrderPage from "./pages/Order.jsx";
import MovieDetailPage from "./pages/details.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import TicketResult from "./pages/Ticket.jsx";
import ProfilePage from "./pages/Profile.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import TickitzMovieCRUD from "./pages/MovieList.jsx";
import MovieSalesDashboard from "./components/Chart.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import MovieForm from "./pages/MovieForm.jsx";
import { useSelector } from "react-redux";

function App() {
  // Route Guard untuk user biasa (non-admin)
  const UserRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);

    // Tidak ada token -> redirect ke login
    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }

    // Jika admin -> redirect ke dashboard admin
    if (auth.role === "admin") {
      return <Navigate to="/movieList" replace />;
    }

    // User biasa -> boleh akses
    return children;
  };

  // Route Guard untuk admin only
  const AdminRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);

    // Tidak ada token -> redirect ke login
    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }

    // Bukan admin -> redirect ke home
    if (auth.role !== "admin") {
      return <Navigate to="/home" replace />;
    }

    // Admin -> boleh akses
    return children;
  };

  // Route Guard umum (user dan admin bisa akses)
  const PrivateRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);

    // Tidak ada token -> redirect ke login
    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }

    // Ada token -> boleh akses
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Bisa diakses tanpa login */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/movies" element={<MovieApp />} />
        <Route path="/home/movies/:id" element={<MovieDetailPage />} />

        {/* User-Only Routes - Hanya user biasa, admin tidak bisa */}
        <Route
          path="/home/payment"
          element={
            <UserRoute>
              <PaymentPage />
            </UserRoute>
          }
        />
        <Route
          path="/home/order"
          element={
            <UserRoute>
              <OrderPage />
            </UserRoute>
          }
        />
        <Route
          path="/home/ticket"
          element={
            <UserRoute>
              <TicketResult />
            </UserRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <UserRoute>
              <OrderHistory />
            </UserRoute>
          }
        />

        {/* Shared Private Routes - User dan admin bisa akses */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Admin-Only Routes - Hanya admin, user biasa tidak bisa */}
        <Route
          path="/movieList"
          element={
            <AdminRoute>
              <TickitzMovieCRUD />
            </AdminRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <AdminRoute>
              <MovieSalesDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/movieForm"
          element={
            <AdminRoute>
              <MovieForm />
            </AdminRoute>
          }
        />
        <Route path="/movies/add" element={<MovieForm />} />
        <Route
          path="/movies/:movieId/edit"
          element={<MovieForm isEdit={true} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
