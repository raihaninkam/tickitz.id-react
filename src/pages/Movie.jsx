import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import NewsletterSubscribe from "../components/Subscribe";

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceTimeoutRef = useRef(null);

  // Get values from URL search params
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentGenre = searchParams.get("genre") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Backend API configuration
  const API_BASE_URL = import.meta.env.VITE_BE_HOST;
  const ITEMS_PER_PAGE = 12; // Adjust based on your preference

  // Initialize search input from URL params
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Update URL search params
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);

    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "all" || value === 1) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });

    setSearchParams(newParams);
  };

  // Debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced search function
  const debouncedUpdateSearch = debounce((value) => {
    updateSearchParams({
      search: value,
      page: 1,
      genre: currentGenre,
    });
  }, 500);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [currentPage, currentGenre, searchQuery]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const loadGenres = async () => {
    try {
      // You'll need to create an endpoint to get genres from your backend
      // For now, using static genres based on your database structure
      const staticGenres = [
        { id: "Action", name: "Action" },
        { id: "Adventure", name: "Adventure" },
        { id: "Animation", name: "Animation" },
        { id: "Comedy", name: "Comedy" },
        { id: "Crime", name: "Crime" },
        { id: "Documentary", name: "Documentary" },
        { id: "Drama", name: "Drama" },
        { id: "Family", name: "Family" },
        { id: "Fantasy", name: "Fantasy" },
        { id: "History", name: "History" },
        { id: "Horror", name: "Horror" },
        { id: "Music", name: "Music" },
        { id: "Mystery", name: "Mystery" },
        { id: "Romance", name: "Romance" },
        { id: "Science Fiction", name: "Sci-Fi" },
        { id: "Thriller", name: "Thriller" },
        { id: "War", name: "War" },
        { id: "Western", name: "Western" },
      ];
      setGenres(staticGenres);
    } catch (error) {
      console.error("Error loading genres:", error);
    }
  };

  const loadMovies = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      // Add title filter if search query exists
      if (searchQuery.trim()) {
        params.append("title", searchQuery);
      }

      // Add genre filter if not "all"
      if (currentGenre !== "all") {
        params.append("genre", currentGenre);
      }

      const response = await fetch(`${API_BASE_URL}/movies/filter?${params}`);
      const data = await response.json();
      console.log(
        "count:",
        data.count,
        "totalPages:",
        Math.ceil(data.count / ITEMS_PER_PAGE)
      );

      if (data.success) {
        setMovies(data.data || []);
        setTotalCount(data.count || 0);
        // Calculate total pages based on items per page
        // You might want to add total_count from backend for accurate pagination
        setTotalPages(Math.max(1, Math.ceil(data.count / ITEMS_PER_PAGE)));
      } else {
        setMovies([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
      setMovies([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedUpdateSearch(value);
  };

  const handleGenreChange = (genreId) => {
    // Clear debounce timeout when genre changes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    updateSearchParams({
      genre: genreId,
      page: 1,
      search: "",
    });

    // Clear search input
    setSearchInput("");
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      updateSearchParams({
        page: page,
        search: searchQuery,
        genre: currentGenre,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Navigate to movie details page
  const showMovieDetails = (movieId) => {
    navigate(`/home/movies/${movieId}`);
  };

  const buyTicket = (movieId) => {
    navigate(`/home/movies/${movieId}`);
  };

  // Helper functions adapted for backend data structure
  const getGenreNames = (genresString) => {
    if (!genresString) return ["Action", "Adventure"];

    const genreArray = genresString.split(", ");
    return genreArray.slice(0, 2);
  };

  const isRecommended = (movie) => {
    return movie && movie.rating >= 7.5;
  };

  // Format release date
  // const formatReleaseDate = (dateString) => {
  //   try {
  //     return new Date(dateString).getFullYear();
  //   } catch {
  //     return "2024";
  //   }
  // };

  // Enhanced MovieCard component adapted for backend data
  const MovieCard = ({ movie, index }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [showMobileButtons, setShowMobileButtons] = useState(false);
    const genres = getGenreNames(movie.genres);

    // Handle mobile tap
    const handleMobileTap = () => {
      setShowMobileButtons(!showMobileButtons);
    };

    // Handle touch events for mobile
    const handleTouchStart = () => {
      setIsPressed(true);
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
    };

    // Get full image URL - adjust based on your backend image serving
    const getImageUrl = (imagePath) => {
      if (!imagePath)
        return "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";

      // If imagePath is already a full URL, return as is
      if (imagePath.startsWith("http")) return imagePath;

      // Otherwise, prepend your backend base URL
      return `${API_BASE_URL}/images/${imagePath}`;
    };

    return (
      <div
        className={`bg-white font-['Mulish'] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 group opacity-0 animate-fade-in-up ${
          isPressed ? "scale-95 shadow-lg" : ""
        }`}
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: "forwards",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isRecommended(movie) && (
          <div className="absolute top-2 left-2 z-20 bg-[#1D4ED8] text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
            Recommended
          </div>
        )}

        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(movie.poster_image)}
            alt={movie.title}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onClick={handleMobileTap}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";
            }}
          />

          {/* Desktop hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center p-6 hidden md:flex">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <button
                onClick={() => showMovieDetails(movie.id)}
                className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors font-semibold"
              >
                View Details
              </button>
              <button
                onClick={() => buyTicket(movie.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Buy Ticket
              </button>
            </div>
          </div>

          {/* Mobile toggle overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 flex items-center justify-center p-6 md:hidden ${
              showMobileButtons
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <button
                onClick={() => showMovieDetails(movie.id)}
                className="px-4 py-2 border-2 border-white text-white rounded-lg active:bg-white active:text-gray-800 transition-colors font-semibold"
              >
                View Details
              </button>
              <button
                onClick={() => buyTicket(movie.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg active:bg-blue-700 transition-colors font-semibold"
              >
                Buy Ticket
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-[#1D4ED8] active:text-[#1D4ED8]">
            {movie.title}
          </h3>

          {/* <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
            <span>{formatReleaseDate(movie.release_date)}</span>
            {movie.duration_minutes && (
              <>
                <span>•</span>
                <span>{movie.duration_minutes} min</span>
              </>
            )}
            {movie.rating && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  ⭐ {movie.rating}
                </span>
              </>
            )}
          </div> */}

          <div className="flex flex-wrap gap-2">
            {genres.map((genre, genreIndex) => (
              <span
                key={genreIndex}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium transition-all duration-300 hover:bg-[#1D4ED8] hover:text-white active:bg-[#1D4ED8] active:text-white cursor-pointer"
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisible = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 my-8">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="w-10 h-10 rounded-full font-semibold transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-10 h-10 rounded-full font-semibold transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className="w-10 h-10 rounded-full font-semibold transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="min-h-screen bg-white font-sans">
        {/* Header */}
        <MyNavbar />

        {/* Hero Section */}
        <div className="bg-[url(/movie-jumbotron.svg)] bg-cover bg-center text-white py-16 px-4 md:px-20">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold tracking-wider uppercase mb-6 opacity-90">
              LIST MOVIE OF THE WEEK
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Experience the Magic of Cinema: Book Your Tickets Today
            </h1>
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span className="w-3 h-3 bg-white/30 rounded-full"></span>
              <span className="w-3 h-3 bg-white/30 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-20 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-end">
            {/* Search Section */}
            <div className="flex-1 w-full">
              <p className="mb-4 font-semibold text-gray-700">Search Movies</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                  <img src="/Search.svg" alt="search" />
                </span>
                <input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
              {/* Show search status */}
              {searchInput !== searchQuery && searchInput.trim() && (
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              )}
            </div>

            {/* Filter Section */}
            <div className="flex-1 w-full">
              <p className="mb-4 font-semibold text-gray-700">
                Filter by Genre
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => handleGenreChange("all")}
                  className={`px-6 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                    currentGenre === "all"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  All
                </button>
                {genres.slice(0, 6).map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreChange(genre.id)}
                    className={`px-6 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                      currentGenre === genre.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results info */}
          {!loading && totalCount > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {movies.length} of {totalCount} movies
              {searchQuery && ` for "${searchQuery}"`}
              {currentGenre !== "all" && ` in ${currentGenre}`}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <div className="mx-auto px-4 md:px-20">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No movies found
              </h3>
              <p className="text-gray-500">
                {searchQuery || currentGenre !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No movies available at the moment"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {movies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            </>
          )}

          {renderPagination()}
        </div>

        {/* Newsletter Section */}
        <NewsletterSubscribe />

        {/* Footer */}
        <MyFooter />
      </div>
    </>
  );
};

export default MovieApp;
