import { useState, useEffect } from "react";

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentGenre, setCurrentGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Fixed API configuration - using direct values instead of environment variables
  const API_KEY = "4c4d8c55a8e8dc48c78b3018b70389ce";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [currentPage, currentGenre, searchQuery]);

  const loadGenres = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
      );
      const data = await response.json();
      setGenres(data.genres || []);
    } catch (error) {
      console.error("Error loading genres:", error);
    }
  };

  const loadMovies = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      let params = new URLSearchParams({
        api_key: API_KEY,
        page: currentPage.toString(),
      });

      if (searchQuery.trim()) {
        endpoint = `${BASE_URL}/search/movie`;
        params.append("query", searchQuery);
      } else if (currentGenre !== "all") {
        endpoint = `${BASE_URL}/discover/movie`;
        params.append("with_genres", currentGenre);
      } else {
        endpoint = `${BASE_URL}/movie/popular`;
      }

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (error) {
      console.error("Error loading movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleGenreChange = (genreId) => {
    setCurrentGenre(genreId);
    setCurrentPage(1);
    setSearchQuery("");

    // Clear search input
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.value = "";
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

//   const showMovieDetails = async (movieId) => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
//       );
//       const movie = await response.json();
//     } catch (error) {
//       console.error("Error loading movie details:", error);
//       alert("Failed to load movie details");
//     }
//   };

  const buyTicket = (movieTitle) => {
    alert(`Redirecting to ticket booking for "${movieTitle}"`);
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
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}

      {/* Hero Section */}
      <div className="bg-[url(movie-jumbotron.svg)] text-white py-16 px-4 md:px-20">
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
          <div className="flex-1">
            <p className="mb-4 font-semibold text-gray-700">Search Movies</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex-1">
            <p className="mb-4 font-semibold text-gray-700">Filter by Genre</p>
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
                  onClick={() => handleGenreChange(genre.id.toString())}
                  className={`px-6 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                    currentGenre === genre.id.toString()
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
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-20">
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
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Now Showing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {movies.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";

                const movieGenres = movie.genre_ids
                  ? movie.genre_ids
                      .map((id) => {
                        const genre = genres.find((g) => g.id === id);
                        return genre ? genre.name : "";
                      })
                      .filter((name) => name)
                      .slice(0, 2)
                  : [];

                return (
                  <div
                    key={movie.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                        <div className="flex flex-wrap gap-3 items-center justify-center">
                          <button
                            // onClick={() => showMovieDetails(movie.id)}
                            className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors font-semibold"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => buyTicket(movie.title)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            Buy Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        {/* <span className="text-yellow-500 text-lg">★</span>
                        <span className="text-sm text-gray-600 font-medium">
                          {movie.vote_average?.toFixed(1) || "N/A"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}
                        </span> */}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {movieGenres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {renderPagination()}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16 px-4 md:px-20 mx-4 md:mx-20 my-16 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-blue-100 mb-8">
            Get the latest movie updates and exclusive offers
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="First name"
              className="px-6 py-3 bg-transparent border-2 border-white rounded-lg text-white placeholder-white/70 flex-1 min-w-0 focus:outline-none focus:border-blue-200"
            />
            <input
              type="email"
              placeholder="Email address"
              className="px-6 py-3 bg-transparent border-2 border-white rounded-lg text-white placeholder-white/70 flex-1 min-w-0 focus:outline-none focus:border-blue-200"
            />
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
     

        </div>
      
  );
};

export default MovieApp;
