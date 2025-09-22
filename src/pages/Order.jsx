import { useEffect, useState } from "react";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentOrder } from "../redux/slices/orderSlice";
import convertTime, { convertDate } from "../utils/timeConvert";
// import { convertTime } from "../utils/timeConvert";

const OrderPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState([]); // Data kursi dari backend
  const [loading, setLoading] = useState(true); // Set ke true untuk initial loading
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data order dari redux persist (hasil inputan dari details.jsx)
  const bookingData = useSelector((state) => state.order.currentOrder);

  const orderData = useSelector((state) => state.order.currentOrder);
  console.log("Order data in Redux:", orderData);

  const sessionData = JSON.parse(sessionStorage.getItem("bookingData"));
  console.log("Order data in SessionStorage:", sessionData);

  // Fallback data jika tidak ada booking data (untuk development)
  const fallbackMovieData = {
    title: "Spider-Man: Homecoming",
    poster_path: "/spiderman-sear.svg",
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" },
    ],
  };

  const token = useSelector((state) => state.auth.token);

  const fallbackBookingDetails = {
    date: "Tuesday, 07 July 2020",
    time: "13:00pm",
    cinema: "CineOne21 Cinema",
    ticketPrice: 10,
    nowShowingId: null, // Set null untuk fallback
  };

  // Use booking data or fallback
  const movieData = bookingData
    ? {
        title: bookingData.movieTitle || bookingData.title,
        poster_path: bookingData.moviePoster
          ? `https://image.tmdb.org/t/p/w500${bookingData.moviePoster}`
          : "/spiderman-sear.svg",
        genres: bookingData.genres || fallbackMovieData.genres,
      }
    : fallbackMovieData;

  const bookingDetails = bookingData
    ? {
        date: convertDate(bookingData.selectedDate),
        time: convertTime(bookingData.selectedTime),
        cinema: bookingData.selectedCinema?.name || "Unknown Cinema",
        location: bookingData.selectedLocation,
        ticketPrice: bookingData.ticketPrice || 10,
        nowShowingId:
          bookingData.nowShowingId || bookingData.selectedCinema?.id || null,
      }
    : fallbackBookingDetails;

  // Demo seat data untuk fallback ketika API gagal
  const generateDemoSeatData = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const demoSeats = [];

    rows.forEach((row) => {
      for (let col = 1; col <= 14; col++) {
        const seatId = `${row}${col}`;
        demoSeats.push({
          seat_id: seatId,
          is_love_nest: row === "F" && col < 10,
        });
      }
    });

    return demoSeats;
  };

  // Fetch seat data from backend
  useEffect(() => {
    const fetchSeats = async () => {
      // Add comprehensive logging for debugging
      console.log("=== SEAT FETCH DEBUG ===");
      console.log("Full booking data:", bookingData);
      console.log("Now Showing ID being used:", bookingDetails.nowShowingId);
      console.log("Available IDs in booking data:", {
        nowShowingId: bookingData?.nowShowingId,
        scheduleId: bookingData?.scheduleId,
        selectedCinemaId: bookingData?.selectedCinema?.id,
        selectedCinemaName: bookingData?.selectedCinema?.name,
      });
      console.log("========================");

      if (!bookingDetails.nowShowingId) {
        console.warn("No nowShowingId found, using demo seat data");
        setSeatData(generateDemoSeatData());
        setError("Using demo data - nowShowingId not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Tambahkan pengecekan token yang lebih robust

        if (!token) {
          throw new Error("No authentication token found");
        }

        console.log(
          "Fetching seats for now_showing_id:",
          bookingDetails.nowShowingId
        );
        console.log(
          "API URL:",
          `${import.meta.env.VITE_BE_HOST}/orders/seats/${
            bookingDetails.nowShowingId
          }`
        );

        const response = await fetch(
          `${import.meta.env.VITE_BE_HOST}/orders/seats/${
            bookingDetails.nowShowingId
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Seats API Response Status:", response.status);

        if (response.status === 401) {
          // Token expired atau invalid
          localStorage.removeItem("token"); // Bersihkan token invalid
          throw new Error("Authentication failed - please login again");
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Seats API Error Response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const result = await response.json();
        console.log("Seats API Success Response:", result);

        if (result.success && result.data) {
          setSeatData(result.data);
          setError(null);
          console.log(
            "Seats data loaded successfully:",
            result.data.length,
            "seats"
          );
        } else {
          throw new Error(result.error || "Failed to fetch seats");
        }
      } catch (err) {
        console.error("Error fetching seats:", err);
        setSeatData(generateDemoSeatData());
        setError(`${err.message} - Using demo data`);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [bookingDetails.nowShowingId]);

  // Process seat data to get sold seats and love nest seats
  const soldSeats = seatData
    .filter((seat) => seat.is_sold)
    .map((seat) => seat.seat_id);
  const loveNest = seatData
    .filter((seat) => seat.is_love_nest)
    .map((seat) => seat.seat_id);

  // Seat data
  const rows = ["A", "B", "C", "D", "E", "F", "G"];

  // Calculate total price
  const totalPrice = selectedSeats.length * bookingDetails.ticketPrice;

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (soldSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Get seat class based on status
  const getSeatClass = (seatId) => {
    if (soldSeats.includes(seatId))
      return "bg-gray-500 text-white cursor-not-allowed";
    if (selectedSeats.includes(seatId)) return "bg-blue-700 text-white";
    if (loveNest.includes(seatId)) return "bg-pink-400";
    return "bg-gray-200 hover:bg-gray-300 cursor-pointer";
  };

  // Handle checkout - save seat data to redux and navigate to payment
  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    // Combine booking data with selected seats
    const completeOrderData = {
      ...bookingData,
      seats: selectedSeats,
      totalSeats: selectedSeats.length,
      totalPayment: totalPrice,
      ticketPrice: bookingDetails.ticketPrice,
    };

    // Simpan ke redux persist
    dispatch(setCurrentOrder(completeOrderData));

    // Navigate to payment
    navigate("/home/payment");
  };

  // Jika tidak ada bookingData, redirect ke home
  useEffect(() => {
    if (!bookingData) {
      console.log("No booking data found, redirecting to home...");
      navigate("/");
    }
  }, [bookingData, navigate]);

  // Jika tidak ada bookingData, show loading atau redirect
  if (!bookingData) {
    return (
      <div className="bg-gray-100 min-h-screen relative">
        <MyNavbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to home...</p>
          </div>
        </div>
        <MyFooter />
      </div>
    );
  }

  // Tampilkan loading hanya untuk seat jika sedang fetch
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen relative">
        <MyNavbar />
        {/* Progress bar */}
        <div className="flex justify-center items-center mt-4">
          <img src="/Frame 5.svg" alt="" className="w-full max-w-md px-4" />
        </div>

        <section className="mt-8 mx-4 md:mx-20">
          <div className="bg-white rounded-lg p-4 md:p-6">
            <div className="flex justify-center items-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading seats...</p>
              </div>
            </div>
          </div>
        </section>
        <MyFooter />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Header */}
      <MyNavbar />

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
                  <h3 className="font-bold text-lg leading-tight pr-2 flex-1">
                    {movieData.title}
                  </h3>
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
                    <p className="text-sm text-gray-700">
                      Regular - (bookingDetails.time)
                    </p>
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
                  <h3 className="font-bold text-xl md:text-2xl mb-2 truncate">
                    {movieData.title}
                  </h3>
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
                  <p className="text-sm text-gray-700">
                    Regular - {bookingDetails.time}
                  </p>
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
            <h2 className="font-bold text-lg md:text-xl mt-6 md:mt-8 mb-4">
              Choose Your Seat
            </h2>

            {/* Error notification - Improved styling */}
            {error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 text-lg">ℹ️</div>
                  <div>
                    <p className="text-blue-800 text-sm font-medium">
                      Demo Mode Active
                    </p>
                    <p className="text-blue-700 text-xs mt-1">
                      {error.includes("API Error")
                        ? "Backend connection failed. Using sample seat data for demonstration."
                        : "No showing ID provided. Using sample seat data for demonstration."}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  {rows.map((row) => (
                    <div key={`left-${row}`} className="contents">
                      <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs md:text-sm font-medium">
                        {row}
                      </span>
                      {[1, 2, 3, 4, 5, 6, 7].map((col) => {
                        const seatId = `${row}${col}`;
                        return (
                          <div
                            key={seatId}
                            className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(
                              seatId
                            )}`}
                            onClick={() => handleSeatClick(seatId)}
                          ></div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Column numbers */}
                  <div className="contents">
                    <span></span>
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                      <span
                        key={`left-col-${col}`}
                        className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right section */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Right seats */}
                  {rows.map((row) => (
                    <div key={`right-${row}`} className="contents">
                      {[8, 9, 10, 11, 12, 13, 14].map((col) => {
                        const seatId = `${row}${col}`;
                        return (
                          <div
                            key={seatId}
                            className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded flex items-center justify-center transition-colors ${getSeatClass(
                              seatId
                            )}`}
                            onClick={() => handleSeatClick(seatId)}
                          ></div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Column numbers */}
                  <div className="contents">
                    {[8, 9, 10, 11, 12, 13, 14].map((col) => (
                      <span
                        key={`right-col-${col}`}
                        className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-xs"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seating key */}
            <h2 className="font-bold text-lg md:text-xl mt-6 md:mt-8 mb-4">
              Seating Key
            </h2>
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
                <img
                  src="/CineOne21 2.svg"
                  alt="cinema logo"
                  className="h-10 md:h-12"
                />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mt-4 mb-6 md:mb-8 text-center">
                {bookingDetails.cinema}
              </h2>

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
                    {selectedSeats.length > 0
                      ? selectedSeats.join(", ")
                      : "None selected"}
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
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-800"
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
      <MyFooter />
    </div>
  );
};

export default OrderPage;
