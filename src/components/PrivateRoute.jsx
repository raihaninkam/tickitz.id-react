// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router";

// export function PrivateRoute({ children }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const isLoggedIn = !!localStorage.getItem("user");
//     const isHome = location.pathname === "/" || location.pathname === "/home";
//     if (!isLoggedIn && !isHome) {
//       navigate("/home", { replace: true });
//     }
//   }, [navigate, location]);

//   return children;
// }