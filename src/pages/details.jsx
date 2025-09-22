import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import { setCurrentOrder } from "../redux/slices/orderSlice";
import { toast } from "react-toastify";

const MovieDetailPage = ({ onBookingDataChange }) => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for schedule data
  const [scheduleData, setScheduleData] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // State untuk semua input booking - semua dimulai kosong/null
  const [bookingData, setBookingData] = useState({
    selectedDate: "",
    selectedTime: "",
    selectedLocation: "",
    selectedCinema: null,
    movieId: null,
    movieTitle: "",
    moviePoster: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  // Backend API configuration
  const API_BASE_URL = import.meta.env.VITE_BE_HOST;

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id);
      fetchScheduleData(id);
      // Update movieId di booking data
      setBookingData((prev) => ({
        ...prev,
        movieId: id,
      }));
    }
  }, [id]);

  // Effect untuk mengirim data booking ke parent component
  useEffect(() => {
    if (onBookingDataChange && typeof onBookingDataChange === "function") {
      onBookingDataChange(bookingData);
    }
  }, [bookingData, onBookingDataChange]);

  // Effect untuk filter schedules berdasarkan pilihan user
  useEffect(() => {
    filterSchedules();
  }, [scheduleData, bookingData.selectedDate, bookingData.selectedLocation]);

  const fetchMovieDetail = async (movieId) => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        "Fetching movie detail from:",
        `${API_BASE_URL}/movies/${movieId}`
      );

      const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Movie not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success && data.data) {
        setMovieData(data.data);

        // Update booking data dengan informasi movie
        setBookingData((prev) => ({
          ...prev,
          movieTitle: data.data.title || "",
          moviePoster: data.data.poster_image || "",
        }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      setError(error.message);
      setMovieData(null);

      // Optional: Show toast error
      toast.error(`Failed to load movie: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch schedule data
  const fetchScheduleData = async (movieId) => {
    setLoadingSchedule(true);

    try {
      console.log(
        "Fetching schedule data from:",
        `${API_BASE_URL}/movies/schedule/${movieId}`
      );

      const response = await fetch(
        `${API_BASE_URL}/movies/schedule/${movieId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No schedules found for this movie");
          setScheduleData([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Schedule data:", data);

      if (data.success && data.data) {
        setScheduleData(data.data);
      } else {
        setScheduleData([]);
      }
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
      setScheduleData([]);

      toast.warn("Schedule data not available", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingSchedule(false);
    }
  };

  // Function to get unique dates from schedule data
  const getAvailableDates = () => {
    const dates = [...new Set(scheduleData.map((schedule) => schedule.date))];
    return dates.sort();
  };

  // Function to get unique locations from schedule data
  const getAvailableLocations = () => {
    const locations = [
      ...new Set(scheduleData.map((schedule) => schedule.location_name)),
    ];
    return locations.sort();
  };

  // Function to get available times based on selected date and location
  const getAvailableTimes = () => {
    if (!bookingData.selectedDate || !bookingData.selectedLocation) {
      return [];
    }

    const times = scheduleData
      .filter(
        (schedule) =>
          schedule.date === bookingData.selectedDate &&
          schedule.location_name === bookingData.selectedLocation
      )
      .map((schedule) => schedule.time);

    return [...new Set(times)].sort();
  };

  // Function to get available cinemas based on selections
  const getAvailableCinemas = () => {
    if (
      !bookingData.selectedDate ||
      !bookingData.selectedLocation ||
      !bookingData.selectedTime
    ) {
      return [];
    }

    const cinemas = scheduleData
      .filter(
        (schedule) =>
          schedule.date === bookingData.selectedDate &&
          schedule.location_name === bookingData.selectedLocation &&
          schedule.time === bookingData.selectedTime
      )
      .map((schedule) => ({
        id: schedule.id,
        name: schedule.cinema_name,
        logo: getCinemaLogo(schedule.cinema_name),
      }));

    return cinemas;
  };

  // Function to get cinema logo based on cinema name
  const getCinemaLogo = (cinemaName) => {
    const logoMap = {
      EBV: "/ebv.id 2.svg",
      Hiflix: "/hiflix 2.svg",
      CineOne21: "/CineOne21 2.svg",
    };
    return logoMap[cinemaName] || "/default-cinema.svg";
  };

  // Function to filter schedules
  const filterSchedules = () => {
    let filtered = [...scheduleData];

    if (bookingData.selectedDate) {
      filtered = filtered.filter(
        (schedule) => schedule.Date === bookingData.selectedDate
      );
    }

    if (bookingData.selectedLocation) {
      filtered = filtered.filter(
        (schedule) => schedule.LocationName === bookingData.selectedLocation
      );
    }

    setFilteredSchedules(filtered);
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format time for display
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If imagePath is already a full URL, return as is
    if (imagePath.startsWith("http")) return imagePath;

    // Otherwise, prepend your backend base URL
    return `${API_BASE_URL}/images/${imagePath}`;
  };

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hours ${mins} minutes`;
  };

  // Helper function to format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Helper function to parse genres
  const getGenresArray = (genresString) => {
    if (!genresString) return [];
    return genresString.split(", ").map((genre, index) => ({
      id: index,
      name: genre.trim(),
    }));
  };

  // Fungsi untuk cek login dan tampilkan toast
  const checkLoginStatus = () => {
    if (!isLoggedIn) {
      toast.error("Please login first to book tickets!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
    return true;
  };

  // Handler untuk update booking data dengan pengecekan login
  const handleInputChange = (field, value) => {
    if (!checkLoginStatus()) {
      return;
    }

    setBookingData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Reset dependent fields when parent selection changes
      if (field === "selectedDate") {
        newData.selectedTime = "";
        newData.selectedCinema = null;
      } else if (field === "selectedLocation") {
        newData.selectedTime = "";
        newData.selectedCinema = null;
      } else if (field === "selectedTime") {
        newData.selectedCinema = null;
      }

      return newData;
    });
  };

  // Handler untuk memilih cinema dengan pengecekan login
  const handleCinemaSelect = (cinema) => {
    if (!checkLoginStatus()) {
      return;
    }

    // Pastikan cinema object lengkap dengan logo
    const completeCinemaData = {
      id: cinema.id,
      name: cinema.name,
      logo: cinema.logo,
    };

    setBookingData((prev) => ({
      ...prev,
      selectedCinema: completeCinemaData,
    }));
  };

  // Handler untuk filter button
  const handleFilter = () => {
    if (!checkLoginStatus()) {
      return;
    }
    filterSchedules();
    console.log("Filter applied", filteredSchedules.length, "results");
  };

  // Handler untuk proses booking - submit data dan navigate ke order page
  const handleBookNow = () => {
    if (!checkLoginStatus()) {
      return;
    }

    // Validasi data booking
    if (!bookingData.selectedDate) {
      toast.warn("Please select a date!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!bookingData.selectedTime) {
      toast.warn("Please select a time!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!bookingData.selectedLocation) {
      toast.warn("Please select a location!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!bookingData.selectedCinema) {
      toast.warn("Please select a cinema!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const selectedSchedule = scheduleData.find(
      (schedule) =>
        schedule.id === bookingData.selectedCinema.id && // This should match the cinema selection
        schedule.date === bookingData.selectedDate &&
        schedule.location_name === bookingData.selectedLocation &&
        schedule.time === bookingData.selectedTime
    );

    console.log("Selected Cinema ID:", bookingData.selectedCinema.id);
    console.log("Selected Schedule found:", selectedSchedule);
    console.log("All schedule data:", scheduleData);

    // Siapkan data lengkap untuk order page dengan data dari backend
    const completeBookingData = {
      ...bookingData,
      genres: getGenresArray(movieData?.genres || ""),
      overview: movieData?.synopsis || "",
      runtime: movieData?.duration_minutes || 0,
      release_date: movieData?.release_date || "",
      director: movieData?.director_name || "Unknown",
      cast: [], // Backend belum menyediakan cast data
      backdrop_path: movieData?.bg_path || "",
      // rating: movieData?.rating || 0,
    };

    dispatch(setCurrentOrder(completeBookingData));

    navigate("/home/order");

    // Pass data ke parent component jika ada callback
    if (onBookingDataChange && typeof onBookingDataChange === "function") {
      onBookingDataChange(completeBookingData);
    }

    // Simpan data ke sessionStorage untuk digunakan di order page
    sessionStorage.setItem("bookingData", JSON.stringify(completeBookingData));

    console.log("Complete Booking Data:", completeBookingData);

    toast.success("Booking successful! Redirecting to order page...", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Mulish']">
        <MyNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="min-h-screen bg-white font-['Mulish']">
        <MyNavbar />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">
            {error === "Movie not found"
              ? "Movie not found"
              : "Failed to load movie"}
          </h3>
          <p className="text-gray-500 mb-4">
            {error === "Movie not found"
              ? "The requested movie could not be found."
              : `Error: ${error || "Unknown error occurred"}`}
          </p>
          <button
            onClick={() => navigate("/home/movies")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Movies
          </button>
        </div>
        <MyFooter />
      </div>
    );
  }

  const genres = getGenresArray(movieData.genres);
  const posterImageUrl = getImageUrl(movieData.poster_image);
  const backgroundImageUrl = getImageUrl(movieData.bg_path);

  // Get dynamic options from schedule data
  const availableDates = getAvailableDates();
  const availableLocations = getAvailableLocations();
  const availableTimes = getAvailableTimes();
  const availableCinemas = getAvailableCinemas();

  return (
    <div className="min-h-screen bg-white font-['Mulish']">
      <MyNavbar />

      <main className="flex flex-col">
        <section
          className="w-full h-96 bg-cover bg-center relative"
          style={{
            backgroundImage: backgroundImageUrl
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImageUrl})`
              : "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://via.placeholder.com/1280x720/e5e7eb/6b7280?text=Movie+Background')",
            backgroundPosition: "15%",
          }}
        />

        <section className="px-4 md:px-32 -mt-35 relative z-10">
          <div className="flex flex-col md:flex-row lg:items-end md:items-center gap-4 mb-8">
            {posterImageUrl ? (
              <img
                src={posterImageUrl}
                alt={movieData.title}
                className="w-80 rounded-lg shadow-lg -mt-20 mx-auto"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";
                }}
              />
            ) : (
              <div className="w-80 h-96 bg-gray-200 rounded-lg shadow-lg -mt-20 mx-auto flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            <div className="flex flex-col gap-4 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white md:text-gray-900">
                {movieData.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-gray-400 mb-1">Release Date</h4>
                  <p className="text-gray-900">
                    {formatReleaseDate(movieData.release_date)}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 mb-1">Directed by</h4>
                  <p className="text-gray-900">
                    {movieData.director_name || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 mb-1">Duration</h4>
                  <p className="text-gray-900">
                    {formatDuration(movieData.duration)}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 mb-1">Casts</h4>
                  <p className="text-gray-900 flex items-center gap-1">
                    {movieData.casts}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
            <p className="text-gray-400 leading-relaxed max-w-4xl">
              {movieData.synopsis || "No synopsis available for this movie."}
            </p>
          </div>
        </section>

        <section className="px-4 md:px-32 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Book Tickets</h2>
            {loadingSchedule && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Loading schedules...
              </div>
            )}
          </div>

          {scheduleData.length === 0 && !loadingSchedule ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No schedules available for this movie
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div>
                  <h4 className="mb-2 font-bold">Choose Date</h4>
                  <select
                    value={bookingData.selectedDate}
                    onChange={(e) =>
                      handleInputChange("selectedDate", e.target.value)
                    }
                    className={`w-full p-3 rounded-lg border-0 text-gray-700 ${
                      !isLoggedIn
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-100 cursor-pointer"
                    }`}
                    disabled={!isLoggedIn || loadingSchedule}
                  >
                    <option value="">Choose Date</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDateForDisplay(date)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Choose Location</h4>
                  <select
                    value={bookingData.selectedLocation}
                    onChange={(e) =>
                      handleInputChange("selectedLocation", e.target.value)
                    }
                    className={`w-full p-3 rounded-lg border-0 text-gray-700 ${
                      !isLoggedIn
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-100 cursor-pointer"
                    }`}
                    disabled={!isLoggedIn || loadingSchedule}
                  >
                    <option value="">Choose Location</option>
                    {availableLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Choose Time</h4>
                  <select
                    value={bookingData.selectedTime}
                    onChange={(e) =>
                      handleInputChange("selectedTime", e.target.value)
                    }
                    className={`w-full p-3 rounded-lg border-0 text-gray-700 ${
                      !isLoggedIn ||
                      !bookingData.selectedDate ||
                      !bookingData.selectedLocation
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-100 cursor-pointer"
                    }`}
                    disabled={
                      !isLoggedIn ||
                      loadingSchedule ||
                      !bookingData.selectedDate ||
                      !bookingData.selectedLocation
                    }
                  >
                    <option value="">Choose Time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {formatTimeForDisplay(time)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleFilter}
                    className={`w-full p-3 rounded-lg transition-colors ${
                      !isLoggedIn
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    }`}
                    disabled={!isLoggedIn || loadingSchedule}
                  >
                    Filter
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <h4 className="font-bold">Choose Cinema</h4>
                  <h4 className="text-gray-500">
                    {availableCinemas.length} Result
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {availableCinemas.map((cinema) => (
                    <div
                      key={`${cinema.id}-${cinema.name}`}
                      onClick={() => handleCinemaSelect(cinema)}
                      className={`flex items-center justify-center h-28 border-2 rounded-lg transition-all ${
                        !isLoggedIn
                          ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                          : bookingData.selectedCinema?.id === cinema.id
                          ? "border-blue-600 bg-blue-50 cursor-pointer"
                          : "border-gray-200 hover:border-blue-600 cursor-pointer"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center w-full px-4">
                        <img
                          src={cinema.logo}
                          className="h-10 object-contain mb-2"
                          alt={cinema.name}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100x40/e5e7eb/6b7280?text=" +
                              cinema.name;
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          {cinema.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {availableCinemas.length === 0 &&
                  bookingData.selectedDate &&
                  bookingData.selectedLocation &&
                  bookingData.selectedTime && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No cinemas available for selected schedule
                      </p>
                    </div>
                  )}

                <div className="flex justify-center">
                  <button
                    onClick={handleBookNow}
                    className={`px-10 py-3 rounded-lg transition-colors ${
                      !isLoggedIn ||
                      !bookingData.selectedDate ||
                      !bookingData.selectedTime ||
                      !bookingData.selectedLocation ||
                      !bookingData.selectedCinema
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    }`}
                    disabled={
                      !isLoggedIn ||
                      !bookingData.selectedDate ||
                      !bookingData.selectedTime ||
                      !bookingData.selectedLocation ||
                      !bookingData.selectedCinema ||
                      loadingSchedule
                    }
                  >
                    {!isLoggedIn ? "Login Required" : "Book Now"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <MyFooter />
    </div>
  );
};

export default MovieDetailPage;
