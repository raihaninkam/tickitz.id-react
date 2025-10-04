import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { fetchUserProfile } from "../redux/slices/authSlice";
import { clearCredentials, logoutUser } from "../hooks/useAuth";

const MyNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ambil dari redux
  const auth = useSelector((state) => state.auth);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const handleLogout = async () => {
    try {
      setLogoutError(null);
      await dispatch(logoutUser()).unwrap();
      setShowUserMenu(false);
      setShowMobileMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Logout failed. Please try again.");
      // Even if the backend logout fails, we still clear the local state
      dispatch(clearCredentials());
      navigate("/login");
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Fetch user profile saat login
  useEffect(() => {
    const { token, user } = auth;
    if (token && (!user || !user.first_name)) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, auth.token, auth.user?.profile_picture]);

  // tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
      if (!event.target.closest(".mobile-menu-container")) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 sm:px-8 lg:px-20 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
            <img src="/tickitz 1.svg" alt="Tickitz Logo" />
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/home"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/home/movies"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            Movie
          </Link>
          <Link
            to="/home/order"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            Buy Ticket
          </Link>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {!auth.token ? (
            <>
              <Link
                to="/Login"
                className="px-6 py-2 border text-blue-700 border-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/Register"
                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative user-menu-container">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={auth.loading}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {auth.user?.profile_picture ? (
                    <img
                      src={`${import.meta.env.VITE_BE_HOST}/public/${
                        auth.user.profile_picture
                      }`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-semibold text-sm">
                      {auth.user?.first_name?.charAt(0) ||
                        auth.user?.last_name?.charAt(0) ||
                        auth.user?.email?.charAt(0) ||
                        "U"}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {auth.user?.first_name && auth.user?.last_name
                        ? `${auth.user.first_name} ${auth.user.last_name}`
                        : auth.user?.first_name ||
                          auth.user?.last_name ||
                          "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {auth.user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Tickets
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Purchase History
                  </Link>

                  <hr className="my-2" />

                  {logoutError && (
                    <div className="px-4 py-2 text-sm text-red-600">
                      {logoutError}
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    disabled={auth.loading}
                    className="flex items-center justify-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {auth.loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden mobile-menu-container">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {showMobileMenu && (
            <div className="absolute right-4 top-16 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <div className="border-b border-gray-100 pb-2 mb-2">
                <Link
                  to="/home"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/home/movies"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Movie
                </Link>
                <Link
                  to="/home/order"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Buy Ticket
                </Link>
              </div>

              {!auth.token ? (
                <div className="px-4 py-2 space-y-2">
                  <Link
                    to="/Login"
                    className="block w-full px-4 py-2 text-center border text-blue-700 border-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/Register"
                    className="block w-full px-4 py-2 text-center bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                        {auth.user?.profile_picture ? (
                          <img
                            src={`${import.meta.env.VITE_BE_HOST}/public/${
                              auth.user.profile_picture
                            }`}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-semibold text-sm">
                            {auth.user?.first_name?.charAt(0) ||
                              auth.user?.last_name?.charAt(0) ||
                              auth.user?.email?.charAt(0) ||
                              "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {auth.user?.first_name && auth.user?.last_name
                            ? `${auth.user.first_name} ${auth.user.last_name}`
                            : auth.user?.first_name ||
                              auth.user?.last_name ||
                              "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {auth.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    My Tickets
                  </Link>
                  <Link
                    to="/purchase-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Purchase History
                  </Link>

                  <hr className="my-2" />

                  {logoutError && (
                    <div className="px-4 py-2 text-sm text-red-600">
                      {logoutError}
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    disabled={auth.loading}
                    className="flex items-center justify-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {auth.loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default MyNavbar;
