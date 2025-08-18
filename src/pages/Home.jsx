import { useState, useEffect } from "react";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import NewsletterSubscribe from "../components/Subscribe";
import { Link, useNavigate } from "react-router";

const SectionHome = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  


  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
  const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const UPCOMING_PER_PAGE = 4;

  // Enhanced Loading skeleton component with shimmer effect
  const MovieSkeleton = ({ className = "" }) => (
    <div className={`animate-pulse ${className}`}>
      <div className="relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 w-full h-[400px] rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-animation"></div>
      </div>
      <div className="relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-4 rounded mb-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-animation"></div>
      </div>
      <div className="flex gap-2 justify-center">
        <div className="relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 w-16 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-animation"></div>
        </div>
        <div className="relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-6 w-20 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-animation"></div>
        </div>
      </div>
    </div>
  );

  // Enhanced Hero skeleton with shimmer effect
  const HeroSkeleton = () => (
    <div className="mt-12 w-full max-w-[320px] sm:max-w-[380px] md:max-w-none lg:w-5/12 mx-auto md:mx-0 h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] grid grid-cols-2 gap-1 xs:gap-2 sm:gap-[6px] md:gap-[8px] grid-rows-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)]">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 w-full h-full rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-animation"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1D4ED8] rounded-full animate-spin"></div>
        <div className="w-8 h-8 border-4 border-gray-100 border-t-[#1D4ED8] rounded-full animate-spin absolute top-2 left-2" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
      </div>
      <p className="text-[#1D4ED8] font-medium mt-4 animate-pulse">Loading movies...</p>
    </div>
  );

  // Enhanced MovieCard with sophisticated hover effects and mobile support
  const MovieCard = ({ movie, index, isUpcoming = false }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [showMobileButtons, setShowMobileButtons] = useState(false);
    const genres = getGenreNames(movie.genre_ids);
    
    // Mock functions for button actions
    const showMovieDetails = (movieId) => {
      console.log(`Showing details for movie ID: ${movieId}`);
      navigate(`/home/movies/${movieId}`);
    };

    const buyTicket = (movieId) => {
      console.log(`Buying ticket for movie ID: ${movieId}`);
      navigate(`/home/movies/${movieId}`);
    };

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
    
    return (
      <div
        className={`bg-white font-['Mulish'] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 group opacity-0 animate-fade-in-up ${
          isPressed ? 'scale-95 shadow-lg' : ''
        }`}
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'forwards'
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
            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onClick={handleMobileTap}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";
            }}
          />
          
          {/* Desktop hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 hidden md:flex">
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
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 flex items-center justify-center p-6 md:hidden ${
            showMobileButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
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
          {isUpcoming && (
            <div className="date font-bold text-[#1D4ED8] mb-3">
              {movie.release_date
                ? formatReleaseDate(movie.release_date)
                : "Coming Soon"}
            </div>
          )}
          
          <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-[#1D4ED8] active:text-[#1D4ED8]">
            {movie.title}
          </h3>
                  
          <div className="flex flex-wrap gap-2">
            {genres.map((genre, genreIndex) => (
              <span
                key={genreIndex}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium transition-all duration-300 hover:bg-[#1D4ED8] hover:text-white active:bg-[#1D4ED8] active:text-white cursor-pointer"
              >
                {genre}
              </span>
            ))}
          </div>

        </div>
      </div>
    );
  };

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching movies from TMDB...");

      // Fetch now playing movies
      const nowPlayingResponse = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );

      if (!nowPlayingResponse.ok) {
        throw new Error(`HTTP error! status: ${nowPlayingResponse.status}`);
      }

      const nowPlayingData = await nowPlayingResponse.json();
      console.log("Now playing movies:", nowPlayingData);

      // Fetch upcoming movies
      const upcomingResponse = await fetch(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      
      if (!upcomingResponse.ok) {
        throw new Error(`HTTP error! status: ${upcomingResponse.status}`);
      }
      
      const upcomingData = await upcomingResponse.json();
      console.log("Upcoming movies:", upcomingData);

      // Fetch popular movies for hero section
      const popularResponse = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      
      if (!popularResponse.ok) {
        throw new Error(`HTTP error! status: ${popularResponse.status}`);
      }
      
      const popularData = await popularResponse.json();
      console.log("Popular movies:", popularData);

      if (nowPlayingData.results && nowPlayingData.results.length > 0) {
        setNowPlayingMovies(nowPlayingData.results.slice(0, 4));
      }

      if (upcomingData.results && upcomingData.results.length > 0) {
        setUpcomingMovies(upcomingData.results.slice(0, 20));
      }

      if (popularData.results && popularData.results.length > 0) {
        setHeroMovies(popularData.results.slice(0, 4));
      }
      
      // Add delay to show loading animation better
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const getGenreNames = (genreIds) => {
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    return (
      genreIds?.slice(0, 2).map((id) => genreMap[id] || "Action") || [
        "Action",
        "Adventure",
      ]
    );
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Coming Soon";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const isRecommended = (movie) => {
    return movie && movie.vote_average >= 7.5;
  };

  // PAGINATION UPCOMING MOVIE
  const totalUpcomingPages = Math.ceil(upcomingMovies.length / UPCOMING_PER_PAGE);

  const pagedUpcomingMovies = upcomingMovies.slice(
    (upcomingPage - 1) * UPCOMING_PER_PAGE,
    upcomingPage * UPCOMING_PER_PAGE
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-red-500 text-lg mb-4">
        Error loading movies: {message}
      </div>
      <button
        onClick={onRetry}
        className="bg-[#1D4ED8] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .shimmer-animation {
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
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
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <MyNavbar />
      <section
        id="home"
        className="flex flex-col md:flex-row md:pr-20 text-center md:text-left "
      >
        <div className="main-desc my-12 mx-4 md:my-40 md:mx-20 md:text-left">
          <div className="text-[#1D4ED8] text-lg mb-4 font-bold">
            <p>MOVIE TICKET PURCHASES #1 IN INDONESIA</p>
          </div>
          <div className="text-[47px] font-medium mb-12 text-center md:text-left leading-tight">
            <p>Experience the Magic of Cinema: Book Your Tickets Today</p>
          </div>
          <div className="text-[#A0A3BD]">
            <p>Sign up and get the ticket with a lot of discount</p>
          </div>
        </div>

        {isLoading ? (
          <HeroSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center mt-16">
            <ErrorMessage message={error} onRetry={fetchMovies} />
          </div>
        ) : heroMovies.length >= 4 ? (
          <div className="mt-12 w-full max-w-[320px] sm:max-w-[380px] md:max-w-none lg:w-5/12 mx-auto md:mx-0 h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] grid grid-cols-2 gap-1 xs:gap-2 sm:gap-[6px] md:gap-[8px] grid-rows-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)]">
            {heroMovies.map((movie, index) => (
              <img
                key={movie.id}
                src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className={`w-full h-full object-cover object-center rounded-lg transition-all duration-500 ease-out transform opacity-0 animate-fade-in-up hover:scale-105 cursor-pointer ${
                  index === 0 ? 'col-start-1 col-end-2 row-start-1 row-end-2 rounded-t-[8px] xs:rounded-t-[10px] sm:rounded-t-[16px] md:rounded-t-[20px] object-[center_20%]' :
                  index === 1 ? 'col-start-2 col-end-3 row-start-1 row-end-3 rounded-t-[8px] xs:rounded-t-[10px] sm:rounded-t-[16px] md:rounded-t-[20px] object-[center_10%]' :
                  index === 2 ? 'col-start-1 col-end-2 row-start-2 row-end-4 rounded-b-[8px] xs:rounded-b-[10px] sm:rounded-b-[16px] md:rounded-b-[20px] object-[center_10%]' :
                  'col-start-2 col-end-3 row-start-3 row-end-4 rounded-b-[8px] xs:rounded-b-[10px] sm:rounded-b-[16px] md:rounded-b-[20px]'
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animationFillMode: 'forwards'
                }}
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hero movies available</p>
          </div>
        )}
      </section>

      <section id="reason" className="mt-8 md:mt-24 flex justify-center md:justify-center">
        <div className="rsn my-12 mx-4 md:my-24 md:mx-20 text-center md:text-left">
          <div className="choose text-[#1D4ED8] font-bold mb-4 md:mb-8 text-center">
            <p>WHY CHOOSE US</p>
          </div>
          <div className="tagline font-normal text-[#121212] text-3xl md:text-[31px] mb-8 md:mb-8 flex flex-wrap justify-center md:justify-center">
            <p className="w-full flex justify-center md:w-auto text-center md:text-center mb-12 text-[47px]">
              Unleashing the Ultimate Movie Experience
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-start items-center gap-12 md:gap-12 text-justify">
            <div className="benefit-guarantee flex flex-col items-center text-center max-w-[280px] w-full group cursor-pointer">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <img src="guaranteed.svg" alt="guaranteed" className="mb-4" />
              </div>
              <div className="step-number font-bold text-lg mb-4 text-center transition-colors duration-300 group-hover:text-[#1D4ED8]">
                Guaranteed
              </div>
              <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px] transition-colors duration-300 group-hover:text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
            <div className="benefit-check flex flex-col items-center text-center max-w-[280px] w-full group cursor-pointer">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <img
                  src="check-circle-fill.svg"
                  alt="check"
                  className="p-4 bg-[rgba(29,78,216,0.2)] rounded-full mb-4 transition-all duration-300 group-hover:bg-[rgba(29,78,216,0.3)]"
                />
              </div>
              <div className="step-number font-bold text-lg mb-4 text-center transition-colors duration-300 group-hover:text-[#1D4ED8]">
                Affordable
              </div>
              <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px] transition-colors duration-300 group-hover:text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
            <div className="benefit-service flex flex-col items-center text-center max-w-[280px] w-full group cursor-pointer">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <img src="247.svg" alt="24/7" className="mb-4" />
              </div>
              <div className="step-number font-bold text-lg mb-4 transition-colors duration-300 group-hover:text-[#1D4ED8]">
                24/7 Customer Support
              </div>
              <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px] transition-colors duration-300 group-hover:text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="movie"
        className="flex flex-wrap flex-row justify-center mt-4 mx-4 md:mx-20"
      >
        <div className="container-movie w-full" />
        <div className="movies font-bold text-lg text-[#1D4ED8] flex justify-center mb-8 w-full">
          <p>MOVIES</p>
        </div>
        <div className="desc-movie text-[47px] md:text-4xl flex justify-center items-center mb-8 w-full text-center px-4">
          <p className="text-[47px]">
            Exciting Movies That Should Be Watched Today
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {[...Array(4)].map((_, index) => (
              <MovieSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchMovies} />
        ) : nowPlayingMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {nowPlayingMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 w-full">
            <p className="text-gray-500">No movies available</p>
          </div>
        )}
        
        <div className="container-movie .img-container mb-32"></div>
        {!isLoading && nowPlayingMovies.length > 0 && (
          <div className="view flex justify-center mt-8 w-full">
            <Link
              to="/home/movies"
              className="flex justify-center items-center gap-2 no-underline font-bold text-[#1D4ED8] text-lg mb-8 transition-all duration-300 hover:gap-4 hover:text-blue-700"
            >
              View All <img src="/arrow-right.svg" alt="arrow right" />
            </Link>
          </div>
        )}
      </section>

      <section id="upcoming-movie" className="mx-4 md:mx-20">
        <div className="container mx-auto mt-4">
          <div className="section-title text-[#1D4ED8] font-bold mb-4 text-center md:text-left">
            <p>UPCOMING MOVIE</p>
          </div>
          <div className="up-movie flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div>
              <p className="font-normal text-[#121212] md:text-[47px] mb-4 md:mb-8">
                Exciting Movie Coming Soon
              </p>
            </div>
            {!isLoading && upcomingMovies.length > 0 && (
              <div className="arrow flex justify-center items-center gap-2 mb-8 md:mb-0">
                <button
                  className={`arrow-left bg-[#A0A3BD] p-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#8a8db5] hover:scale-110 ${
                    upcomingPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setUpcomingPage((prev) => Math.max(prev - 1, 1))}
                  disabled={upcomingPage === 1}
                >
                  <img src="arrow-left.svg" alt="" />
                </button>
                <button
                  className={`arrow-right bg-[#1D4ED8] text-white p-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:scale-110 ${
                    upcomingPage === totalUpcomingPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() =>
                    setUpcomingPage((prev) => Math.min(prev + 1, totalUpcomingPages))
                  }
                  disabled={upcomingPage === totalUpcomingPages}
                >
                  <img src="arrow-up.svg" alt="" />
                </button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <MovieSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchMovies} />
          ) : upcomingMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pagedUpcomingMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} isUpcoming={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming movies available</p>
            </div>
          )}
        </div>
      </section>

      <NewsletterSubscribe />
      <MyFooter />
    </>
  );
};

export default SectionHome;