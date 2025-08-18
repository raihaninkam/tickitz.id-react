import { useEffect, useState } from 'react';
import MyNavbar from '../components/Navbar';
import MyFooter from '../components/Footer';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { setCurrentOrder } from "../redux/slices/orderSlice"; // pastikan path benar

const OrderPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats] = useState(['A6', 'B2', 'B3', 'D2', 'E4', 'G3', 'A12', 'C9', 'C12', 'D9', 'D12', 'F13']);
  const [loveNest] = useState(['F10', 'F11']);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data order dari redux persist (hasil inputan dari details.jsx)
  const bookingData = useSelector(state => state.order.currentOrder);

  // Fallback data jika tidak ada booking data (untuk development)
  const fallbackMovieData = {
    title: "Spider-Man: Homecoming",
    poster_path: "/spiderman-sear.svg", 
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" }
    ]
  };

  const fallbackBookingDetails = {
    date: 'Tuesday, 07 July 2020',
    time: '13:00pm',
    cinema: 'CineOne21 Cinema',
    ticketPrice: 10
  };

  // Use booking data or fallback
  const movieData = bookingData ? {
    title: bookingData.movieTitle || bookingData.title,
    poster_path: bookingData.moviePoster ? `https://image.tmdb.org/t/p/w500${bookingData.moviePoster}` : "/spiderman-sear.svg",
    genres: bookingData.genres || fallbackMovieData.genres
  } : fallbackMovieData;

  const bookingDetails = bookingData ? {
    date: bookingData.selectedDate,
    time: bookingData.selectedTime,
    cinema: bookingData.selectedCinema?.name || 'Unknown Cinema',
    location: bookingData.selectedLocation,
    ticketPrice: 10 // You can make this dynamic based on cinema/location
  } : fallbackBookingDetails;

  // Seat data
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Calculate total price
  const totalPrice = selectedSeats.length * bookingDetails.ticketPrice;

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
    if(loveNest.includes(seatId)) return 'bg-pink-400'
    return 'bg-gray-200 hover:bg-gray-300 cursor-pointer';
  };

  // Handle checkout - save seat data to redux and navigate to payment
  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat!');
      return;
    }

    // Combine booking data with selected seats
    const completeOrderData = {
      ...bookingData,
      seats: selectedSeats,
      totalSeats: selectedSeats.length,
      totalPayment: totalPrice,
      ticketPrice: bookingDetails.ticketPrice
    };

    // Simpan ke redux persist
    dispatch(setCurrentOrder(completeOrderData));
    
    // Navigate to payment
    navigate('/home/payment');
  };

  // Jika tidak ada bookingData, redirect ke home
  useEffect(() => {
    if (!bookingData) {
    navigate('/');
    
  }

  }, [bookingData, navigate]);


   if (!bookingData) {
    return null;
    
  }

  

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Header */}
      <MyNavbar/>

      {/* Progress bar */}
      <div className="flex justify-center items-center mt-4">
        <img src="/Frame 5.svg" alt="" className="w-full max-w-md px-4" />
      </div>
      
      {/* Main content */}
      <section className="mt-8 mx-4 md:mx-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left section - Seat selection */}
          <div className="bg-white rounded-lg p-4 md:p-6 flex-1">
            {/* Movie info - Fixed responsive design */}
            <div className="border border-blue-400 rounded-lg p-3 md:p-4 mb-6">
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                {/* Movie Title */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg leading-tight pr-2 flex-1">{movieData.title}</h3>
                  <button 
                    className="bg-blue-600 text-white rounded px-3 py-1 text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                    onClick={() => navigate(-1)}
                  >
                    Change
                  </button>
                </div>

                {/* Poster and Info */}
                <div className="flex gap-3">
                  <img 
                    src={movieData.poster_path}
                    alt={movieData.title}
                    className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movieData.genres.map((genre) => (
                        <span 
                          key={genre.id}
                          className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1 font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">Regular - {bookingDetails.time}</p>
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet Layout */}
              <div className="hidden sm:flex items-center gap-4 md:gap-6">
                {/* Poster */}
                <img 
                  src={movieData.poster_path}
                  alt={movieData.title}
                  className="w-24 md:w-32 h-16 md:h-20 object-cover rounded-lg flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl md:text-2xl mb-2 truncate">{movieData.title}</h3>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {movieData.genres.map((genre) => (
                      <span 
                        key={genre.id}
                        className="bg-gray-100 text-gray-400 text-xs rounded-full px-3 md:px-4 py-1 font-medium"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">Regular - {bookingDetails.time}</p>
                </div>

                {/* Change Button */}
                <button 
                  className="bg-blue-600 text-white rounded px-4 md:px-5 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                  onClick={() => navigate(-1)}
                >
                  Change
                </button>
              </div>
            </div>

            {/* Seat selection */}
            <h2 className="font-bold text-lg md:text-xl mt-6 md:mt-8 mb-4">Choose Your Seat</h2>
            <div className="text-center my-6 md:my-8">
              <div className="w-full h-1 bg-gray-300 rounded mb-2"></div>
              <p className="text-gray-500 text-sm">Screen</p>
            </div>

            {/* Seat grid - Improved mobile responsiveness */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-2 md:gap-4 lg:gap-12 justify-center min-w-max">
                {/* Left section */}
                <div className="grid grid-cols-8 gap-1">
                  {/* Row labels and left seats */}
                  {rows.map(row => (
                    <div key={`left-${row}`} className="contents">
                      <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs md:text-sm font-medium">{row}</span>
                      {[1, 2, 3, 4, 5, 6, 7].map(col => {
                        const seatId = `${row}${col}`;
                        return (
                          <div 
                            key={seatId}
                            className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(seatId)}`}
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
                      <span key={`left-col-${col}`} className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right section */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Right seats */}
                  {rows.map(row => (
                    <div key={`right-${row}`} className="contents">
                      {[8, 9, 10, 11, 12, 13, 14].map(col => {
                        const seatId = `${row}${col}`;
                        return (
                          <div 
                            key={seatId}
                            className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(seatId)}`}
                            onClick={() => handleSeatClick(seatId)}
                          >
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Column numbers */}
                  <div className="contents">
                    {[8, 9 ,10 ,11, 12, 13, 14].map(col => (
                      <span key={`right-col-${col}`} className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seating key */}
            <h2 className="font-bold text-lg md:text-xl mt-6 md:mt-8 mb-4">Seating Key</h2>
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-8 mb-6 md:mb-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded flex-shrink-0"></div>
                <p className="text-sm">Available</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-700 rounded flex-shrink-0"></div>
                <p className="text-sm">Selected</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-pink-400 rounded flex-shrink-0"></div>
                <p className="text-sm">Love nest</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-500 rounded flex-shrink-0"></div>
                <p className="text-sm">Sold</p>
              </div>
            </div>
          </div>

          {/* Right section - Order summary */}
          <div className="lg:w-80">
            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg">
              <div className="flex justify-center mt-4 md:mt-8">
                <img src="/CineOne21 2.svg" alt="cinema logo" className="h-10 md:h-12" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mt-4 mb-6 md:mb-8 text-center">{bookingDetails.cinema}</h2>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between text-sm items-start">
                  <p className="text-gray-600">Movie selected</p>
                  <p className="font-bold text-right ml-4">{movieData.title}</p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">{bookingDetails.date}</p>
                  <p className="font-bold">{bookingDetails.time}</p>
                </div>

                {bookingDetails.location && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Location</p>
                    <p className="font-bold">{bookingDetails.location}</p>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">One ticket price</p>
                  <p className="font-bold">${bookingDetails.ticketPrice}</p>
                </div>
                
                <div className="flex justify-between text-sm pb-4 border-b border-gray-300 items-start">
                  <p className="text-gray-600">Seat choosed</p>
                  <p className="font-bold text-right ml-4">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                  </p>
                </div>
                
                <div className="flex justify-between font-bold text-lg mt-6 md:mt-8">
                  <p>Total Payment</p>
                  <p className="text-blue-700">${totalPrice}</p>
                </div>
              </div>
              
              
            </div>
            <div className="flex justify-center mt-6 md:mt-8">
                <button
                  onClick={handleCheckout}
                  className={`bg-blue-700 w-full text-white rounded px-6 md:px-8 py-3 font-bold text-center text-sm md:text-base transition-colors ${
                    selectedSeats.length === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-800'
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Checkout now
                </button>
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