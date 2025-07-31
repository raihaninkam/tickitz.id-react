
import Login from "./components/Login.jsx";
import MovieApp from "./pages/Movie.jsx";
import MyFooter from "./components/Footer.jsx";
import MyNavbar from "./components/Navbar.jsx";
import Register from "./components/Register.jsx";
import Home from "./pages/Home.jsx";
import PaymentPage from "./pages/payment.jsx";
import OrderPage from "./pages/Order.jsx";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

function App() {
  return (
    <>


    <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<MyLayout />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="movies" element={<MovieApp />} />
            <Route path="Home" element={<Home />} />
            <Route path="payment" element={< PaymentPage/>} />
            <Route path="order" element={< OrderPage/>} />

          </Route>
        </Routes>
      </BrowserRouter>

    




    </>
  );
}


function MyLayout () {
  return(
    <>
      <MyNavbar/>
      <Outlet/>
      <MyFooter/>
    </>
  )
}

export default App;
