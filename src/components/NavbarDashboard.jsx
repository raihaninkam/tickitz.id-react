function NavbarDashboard() {
  return (
    <>
       <header className="bg-white py-4 shadow-sm">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <img src="/tickitz 1.svg" alt="" />
      
                <nav className="hidden lg:flex gap-8">
                  <a
                    href="#"
                    className="text-slate-500 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="text-slate-500 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    Movie
                  </a>
                  <a
                    href="#"
                    className="text-slate-500 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    Buy Ticket
                  </a>
                </nav>
      
                <button className="lg:hidden text-slate-500 text-xl p-2">☰</button>
      
                <div className="hidden lg:flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm cursor-pointer px-3 py-2 rounded-md hover:bg-slate-50 transition-colors">
                    <span>Location</span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                      <path d="M6 8L0 2L1.41 0.59L6 5.17L10.59 0.59L12 2L6 8Z" />
                    </svg>
                  </div>
                  <button className="text-slate-500 p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gray-300 bg-cover bg-center"></div>
                </div>
              </div>
            </header>
    </>
  )
}

export default NavbarDashboard
