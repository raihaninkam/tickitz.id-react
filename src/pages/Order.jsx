import { useState } from 'react';
import MyNavbar from '../components/Navbar';
import MyFooter from '../components/Footer';

const OrderPage = () => {
  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats] = useState(['A6', 'B1', 'B9', 'C3', 'D5', 'E2', 'F7']);

  // Seat data
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Calculate total price
  const totalPrice = selectedSeats.length * 10;

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (soldSeats.includes(seatId)) return; 

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Get seat class based on status
  const getSeatClass = (seatId) => {
    if (soldSeats.includes(seatId)) return 'bg-gray-500 text-white cursor-not-allowed';
    if (selectedSeats.includes(seatId)) return 'bg-blue-700 text-white';
    return 'bg-gray-200 hover:bg-gray-300 cursor-pointer';
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Header */}
      <MyNavbar/>

      {/* Progress bar */}
      <div className="flex justify-center items-center mt-4">
        <img src="progress2.svg" alt="" />
      </div>
      {/* Main content */}
      <section className="mt-12 mx-20">
        <div className="flex gap-8">
          {/* Left section - Seat selection */}
          <div className="bg-white rounded p-4 flex-1">
            {/* Movie info */}
            <div className="border border-gray-300 rounded p-4 mb-4">
              <div className="flex items-center gap-4">
                <img src="spiderman-sear.svg" alt="movie" className="" />
                <p className="font-bold text-2xl">Spider-Man: Homecoming</p>
              </div>
              
              <div className="flex gap-4 mt-4 ml-24">
                <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-3 py-1">Action</span>
                <span className="bg-gray-100 text-gray-500 text-xs rounded-full px-3 py-1">Adventure</span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p>Regular - 13:00 PM</p>
                <a className="bg-blue-700 text-white rounded px-8 py-2 cursor-pointer">Change</a>
              </div>
            </div>

            {/* Seat selection */}
            <h2 className="font-bold text-xl mt-8 mb-4">Choose Your Seat</h2>
            <div className="text-center my-12 ml-40">
              <p>Screen</p>
            </div>

            {/* Seat grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-4 ml-12">
                {/* Left section */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {/* Row labels and left seats */}
                  {rows.map(row => (
                    <div key={`left-${row}`} className="contents">
                      <span className="flex items-center justify-center w-6 h-6">{row}</span>
                      {[1, 2, 3, 4, 5, 6, 7].map(col => {
                        const seatId = `${row}${col}`;
                        return (
                          <div 
                            key={seatId}
                            className={`w-8 h-8 rounded flex items-center justify-center ${getSeatClass(seatId)}`}
                            onClick={() => handleSeatClick(seatId)}
                          >
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Column numbers */}
                  <div className="contents">
                    <span></span>
                    {[1, 2, 3, 4, 5, 6, 7].map(col => (
                      <span key={`left-col-${col}`} className="flex items-center justify-center w-6 h-6">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right section */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {/* Right seats */}
                  {rows.map(row => (
                    <div key={`right-${row}`} className="contents">
                      {[1, 2, 3, 4, 5, 6, 7].map(col => {
                        const seatId = `${row}${col}`;
                        return (
                          <div 
                            key={seatId}
                            className={`w-8 h-8 rounded flex items-center justify-center ${getSeatClass(seatId)}`}
                            onClick={() => handleSeatClick(seatId)}
                          >
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Column numbers */}
                  <div className="contents">
                    {[1, 2, 3, 4, 5, 6, 7].map(col => (
                      <span key={`right-col-${col}`} className="flex items-center justify-center w-6 h-6">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seating key */}
            <h2 className="font-bold mt-8 mb-4">Seating Key</h2>
            <div className="flex gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <p>Available</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-700 rounded"></div>
                <p>Selected</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-400 rounded"></div>
                <p>Love nest</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
                <p>Sold</p>
              </div>
            </div>
          </div>

          {/* Right section - Order summary */}
          <div className="bg-white rounded w-96">
            <div className="p-8">
              <div className="flex justify-center mt-8">
                <img src="CineOne21 2.svg" alt="cinema logo" />
              </div>
              <h2 className="text-3xl font-medium mt-4 mb-8 flex justify-center">CineOne21 Cinema</h2>
              
              <div className="flex justify-between text-sm mb-4">
                <p>Movie selected</p>
                <p className="font-bold">Spider-Man: Homecoming</p>
              </div>
              
              <div className="flex justify-between text-sm mb-4">
                <p>Tuesday, 07 July 2020</p>
                <p className="font-bold">13:00pm</p>
              </div>
              
              <div className="flex justify-between text-sm mb-4">
                <p>One ticket price</p>
                <p className="font-bold">$10</p>
              </div>
              
              <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-300">
                <p>Seat choosed</p>
                <p className="font-bold">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                </p>
              </div>
              
              <div className="flex justify-between font-bold mt-8">
                <p>Total Payment</p>
                <p className="text-blue-700">${totalPrice}</p>
              </div>
              
              <div className="flex justify-center mt-8">
                <button 
                  className={`bg-blue-700 text-white rounded px-32 py-2 font-bold ${selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedSeats.length === 0}
                >
                  <a href="payment.html">Checkout now</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
     <MyFooter/>
    </div>
  );
};

export default OrderPage;