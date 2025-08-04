import { useState, useEffect } from 'react';
import MyNavbar from '../components/Navbar';
import MyFooter from '../components/Footer';
import { Link, useNavigate } from 'react-router';

const OrderPage = () => {
  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats] = useState(['A6', 'B2', 'B3', 'D2', 'E4', 'G3', 'A12', 'C9', 'C12', 'D9', 'D12', 'F13']);
  const [loveNest] = useState(['F10', 'F11']);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load booking data from sessionStorage
  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('bookingData');
    if (savedBookingData) {
      try {
        const parsedData = JSON.parse(savedBookingData);
        setBookingData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        // Redirect back to home if no valid booking data
        navigate('/');
      }
    } else {
      // Redirect back to home if no booking data
      navigate('/');
    }
  }, [navigate]);

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
    title: bookingData.movieTitle,
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

  // Handle checkout - save seat data and navigate to payment
  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat!');
      return;
    }

    // Combine booking data with selected seats
    const completeOrderData = {
      ...bookingData,
      selectedSeats: selectedSeats,
      totalSeats: selectedSeats.length,
      totalPrice: totalPrice,
      ticketPrice: bookingDetails.ticketPrice
    };

    // Save to sessionStorage for payment page
    sessionStorage.setItem('orderData', JSON.stringify(completeOrderData));
    
    console.log('Order data for payment:', completeOrderData);
    
    // Navigate to payment
    navigate('/home/payment');
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <MyNavbar/>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Header */}
      <MyNavbar/>

      {/* Progress bar */}
      <div className="flex justify-center items-center mt-4">
        <img src="/Frame 5.svg" alt="" />
      </div>
      
      {/* Main content */}
      <section className="mt-12 mx-4 md:mx-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left section - Seat selection */}
          <div className="bg-white rounded-lg p-4 flex-1">
            {/* Movie info */}
            <div className="border border-gray-300 rounded p-4 mb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={movieData.poster_path}
                  alt={movieData.title}
                  className="w-46 h-28 object-cover rounded flex-shrink-0"
                />
                <p className="font-bold text-xl md:text-2xl">{movieData.title}</p>
              </div>
              
              <div className="flex gap-2 mt-4 ml-16">
                {movieData.genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="bg-gray-100 text-gray-500 text-xs rounded-full px-3 py-1"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm md:text-base">Regular - {bookingDetails.time}</p>
                <button 
                  className="bg-blue-700 text-white rounded px-4 md:px-8 py-2 text-sm md:text-base cursor-pointer hover:bg-blue-800 transition-colors"
                  onClick={() => navigate(-1)}
                >
                  Change
                </button>
              </div>
            </div>


            {/* Seat selection */}
            <h2 className="font-bold text-xl mt-8 mb-4">Choose Your Seat</h2>
            <div className="text-center my-8">
              <div className="w-full h-1 bg-gray-300 rounded mb-2"></div>
              <p className="text-gray-500">Screen</p>
            </div>

            {/* Seat grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-4 md:gap-12 justify-center">
                {/* Left section */}
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {/* Row labels and left seats */}
                  {rows.map(row => (
                    <div key={`left-${row}`} className="contents">
                      <span className="flex items-center justify-center w-6 h-6 text-sm font-medium">{row}</span>
                      {[1, 2, 3, 4, 5, 6, 7].map(col => {
                        const seatId = `${row}${col}`;
                        return (
                          <div 
                            key={seatId}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(seatId)}`}
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
                      <span key={`left-col-${col}`} className="flex items-center justify-center w-6 h-6 text-xs">
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
                      {[8, 9, 10, 11, 12, 13, 14].map(col => {
                        const seatId = `${row}${col}`;
                        return (
                          <div 
                            key={seatId}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(seatId)}`}
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
                      <span key={`right-col-${col}`} className="flex items-center justify-center w-6 h-6 text-xs">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seating key */}
            <h2 className="font-bold mt-8 mb-4">Seating Key</h2>
            <div className="flex flex-wrap gap-4 md:gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <p className="text-sm">Available</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-700 rounded"></div>
                <p className="text-sm">Selected</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-400 rounded"></div>
                <p className="text-sm">Love nest</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-500 rounded"></div>
                <p className="text-sm">Sold</p>
              </div>
            </div>
          </div>

          {/* Right section - Order summary */}
          <div className="lg:w-80">
            <div className="bg-white p-6 md:p-8 rounded-lg  top-4">
              <div className="flex justify-center mt-8">
                <img src="/CineOne21 2.svg" alt="cinema logo" className="h-12" />
              </div>
              <h2 className="text-2xl md:text-3xl font-medium mt-4 mb-8 text-center">{bookingDetails.cinema}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <p>Movie selected</p>
                  <p className="font-bold text-right">{movieData.title}</p>
                </div>
                
                <div className="flex justify-between text-sm">
                  <p>{bookingDetails.date}</p>
                  <p className="font-bold">{bookingDetails.time}</p>
                </div>

                {bookingDetails.location && (
                  <div className="flex justify-between text-sm">
                    <p>Location</p>
                    <p className="font-bold">{bookingDetails.location}</p>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <p>One ticket price</p>
                  <p className="font-bold">${bookingDetails.ticketPrice}</p>
                </div>
                
                <div className="flex justify-between text-sm pb-4 border-b border-gray-300">
                  <p>Seat choosed</p>
                  <p className="font-bold text-right">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                  </p>
                </div>
                
                <div className="flex justify-between font-bold text-lg mt-8">
                  <p>Total Payment</p>
                  <p className="text-blue-700">${totalPrice}</p>
                </div>
              </div>
              
              
            </div>
            <div className="flex justify-center mt-8">
                <button
                  onClick={handleCheckout}
                  className={`bg-blue-700 w-full text-white rounded px-8 md:px-1 py-2 font-bold text-center text-md transition-colors ${
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