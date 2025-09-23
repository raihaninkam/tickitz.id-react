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
  const PrivateRoute = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    if (!auth.token) return <Navigate to="/login" replace />;
    if (auth.role !== "admin") return <Navigate to="/home" replace />;
    return children;
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          {/* Main app routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home/movies" element={<MovieApp />} />
          <Route path="/home/movies/:id" element={<MovieDetailPage />} />
          <Route path="/home/payment" element={<PaymentPage />} />
          <Route path="/home/order" element={<OrderPage />} />
          <Route path="/home/ticket" element={<TicketResult />} />

          {/* dashboard app routes */}
          <Route path="/" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route
            path="/movieList"
            element={
              <PrivateRoute>
                <TickitzMovieCRUD />
              </PrivateRoute>
            }
          />
          <Route
            path="/chart"
            element={
              <PrivateRoute>
                <MovieSalesDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/movieForm" element={<MovieForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
