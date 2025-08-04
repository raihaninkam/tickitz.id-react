import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

const MyNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
          
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error reading user session:', error);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    try {
      
      localStorage.removeItem('currentUser');
      
      setIsLoggedIn(false);
      setCurrentUser(null);
      setShowUserMenu(false);
      alert('Logout berhasil!');
      navigate('/Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Toggle user dropdown menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (!event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 sm:px-8 lg:px-20 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
           <img src="/tickitz 1.svg" alt="" />
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
          {!isLoggedIn ? (
            // Not logged in - Show Sign In/Sign Up buttons
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
            // Logged in - Show user profile dropdown
            <div className="relative user-menu-container">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-semibold text-sm">
                      {currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {currentUser?.email}
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
                    to="/my-tickets"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Tickets
                  </Link>
                  
                  <Link
                    to="/purchase-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Purchase History
                  </Link>
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
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
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="absolute right-4 top-16 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              {/* Mobile Navigation Links */}
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
                  to="/buy-ticket"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Buy Ticket
                </Link>
              </div>

              {/* Mobile Auth Section */}
              {!isLoggedIn ? (
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
                        {currentUser?.avatar ? (
                          <img 
                            src={currentUser.avatar} 
                            alt="User Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-semibold text-sm">
                            {currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentUser?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {currentUser?.email}
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
                    to="/my-tickets"
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
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
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