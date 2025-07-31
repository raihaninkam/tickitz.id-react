import {Link} from "react-router";

const MyNavbar = () => {
  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <nav className="flex justify-between items-center px-8 lg:px-20 py-4">
          <div className="flex items-center">
            <img src="tickitz 1.svg" alt="Tickitz Logo" className="h-8" />
          </div>

          <div className="hidden md:flex space-x-8">
            <Link to="/home"
              className="text-gray-800 hover:text-primary transition-colors"
              >Home
            </Link>

            <Link
              to="/movies"
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Movie
            </Link>

            <Link
              to=""
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Buy Ticket
            </Link>
          </div>

          <div className="hidden md:flex space-x-4">
            <Link to ="/Login"
              className="px-6 py-2 border text-blue-700 border-blue-700 rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link to= "/Register"
              
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <div className="md:hidden">
            <img src="gg_menu-right-alt.svg" alt="" />
          </div>
        </nav>
      </header>
    </>
  );
};

export default MyNavbar;
