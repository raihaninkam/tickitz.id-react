const MyNavbar = () => {
    return (
    <>
        <header className="bg-white border-b border-gray-200">
      <nav className="flex justify-between items-center px-8 lg:px-20 py-4">
        <div className="flex items-center">
          <img
            src="tickitz 1.svg"
            alt="Tickitz Logo"
            className="h-8"
          />
        </div>

        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-800 hover:text-primary transition-colors"
            >Home</a
          >
          <a href="#" className="text-gray-800 hover:text-primary transition-colors"
            >Movie</a
          >
          <a href="#" className="text-gray-800 hover:text-primary transition-colors"
            >Buy Ticket</a
          >
        </div>

        <div className="hidden md:flex space-x-4">
          <a
            href="#"
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >Sign In</a
          >
          <a
            href="#"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >Sign Up</a
          >
        </div>

        <div className="md:hidden">
          <img src="./assets/img/gg_menu-right-alt.svg" alt=""/>
        </div>
      </nav>
    </header>

    </>
    );
}

export default MyNavbar;