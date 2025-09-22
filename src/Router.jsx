import Login from "./components/Login.jsx";
import MovieApp from "./pages/Movie.jsx";
import Register from "./components/Register.jsx";
import Home from "./pages/Home.jsx";
import PaymentPage from "./pages/Payment.jsx";
import OrderPage from "./pages/Order.jsx";
import MovieDetailPage from "./pages/details.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import TicketResult from "./pages/Ticket.jsx";
import ProfilePage from "./pages/Profile.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import TickitzMovieCRUD from "./pages/MovieList.jsx";
import MovieSalesDashboard from "./components/Chart.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import MovieForm from "./pages/MovieForm.jsx";

function App() {
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
          <Route path="/movieList" element={<TickitzMovieCRUD />} />
          <Route path="/chart" element={<MovieSalesDashboard />} />
          <Route path="/movieForm" element={<MovieForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
