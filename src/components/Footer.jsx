const MyFooter = () => {
    return(
        <>
            <footer className="bg-white mt-8">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src="tickitz 1.svg"
              alt="Tickitz Logo"
              className="h-8 mb-4"
            />
            <p className="text-gray-600 text-sm">
              Stop waiting in line. Buy tickets
            </p>
            <p className="text-gray-600 text-sm">
              conveniently, watch movies quietly.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Cinemas</li>
              <li>Movies List</li>
              <li>My Ticket</li>
              <li>Notification</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Our Sponsor</h3>
            <div className="space-y-3">
              <div
                className="w-16 h-8 flex items-center justify-center"
              >
                <img src="ebv.id 2.svg" alt=""/>
              </div>
              <div
                className="w-16 h-8 flex items-center justify-center"
              >
                <img src="CineOne21 2.svg" alt=""/>
              </div>
              <div
                className="w-16 h-8 flex items-center justify-center"
              >
                <img src="hiflix 2.svg" alt=""/>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Follow us</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <img src="eva_facebook-outline.svg" alt=""/>
                <span>Tickitz Cinema id</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="bx_bxl-instagram.svg" alt=""/>
                <span>tickitz.id</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="eva_twitter-outline.svg" alt=""/>
                <span>tickitz.id</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="feather_youtube.svg" alt=""/>
                <span>Tickitz Cinema id</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          &copy; 2020 Tickitz. All Rights Reserved.
        </p>
      </div>
    </footer>
        </>
    )
}

export default MyFooter;