import { useState, useEffect } from "react";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import NewsletterSubscribe from "../components/Subscribe";

const SectionHome = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
  const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const fetchMovies = async () => {
    try {
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
      const upcomingData = await upcomingResponse.json();
      console.log("Upcoming movies:", upcomingData);

      // Fetch popular movies for hero section
      const popularResponse = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const popularData = await popularResponse.json();
      console.log("Popular movies:", popularData);

      if (nowPlayingData.results && nowPlayingData.results.length > 0) {
        setNowPlayingMovies(nowPlayingData.results.slice(0, 4));
      }

      if (upcomingData.results && upcomingData.results.length > 0) {
        setUpcomingMovies(upcomingData.results.slice(0, 4));
      }

      if (popularData.results && popularData.results.length > 0) {
        setHeroMovies(popularData.results.slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Keep arrays empty to use fallback data
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

  // Fallback data in case API fails
  const fallbackMovies = [
    {
      id: 1,
      title: "Black Widow",
      poster_path: "/blackwidow.svg",
      genre_ids: [28, 12],
      vote_average: 7.0,
    },
    {
      id: 2,
      title: "Tenet",
      poster_path: "/tenet.svg",
      genre_ids: [18, 10749],
      vote_average: 8.0,
    },
    {
      id: 3,
      title: "The Witch",
      poster_path: "/the-witch.svg",
      genre_ids: [35, 10751],
      vote_average: 7.8,
    },
    {
      id: 4,
      title: "Spiderman",
      poster_path: "/spiderman-film.svg",
      genre_ids: [53, 27],
      vote_average: 8.2,
    },
  ];

  const fallbackHeroMovies = [
    { id: 1, title: "Lion King", poster_path: "lion-king.svg" },
    { id: 2, title: "Expendables", poster_path: "expendables.svg" },
    { id: 3, title: "Spiderman", poster_path: "spiderman.svg" },
    { id: 4, title: "Roblox", poster_path: "roblox.svg" },
  ];

  const currentNowPlaying =
    nowPlayingMovies.length > 0 ? nowPlayingMovies : fallbackMovies;
  const currentUpcoming =
    upcomingMovies.length > 0 ? upcomingMovies : fallbackMovies;
  const currentHero = heroMovies.length > 0 ? heroMovies : fallbackHeroMovies;

  return (
    <>
      {/* MyNavbar would go here */}
      <MyNavbar />
      <section
        id="home"
        className="flex flex-col md:flex-row md:pr-8 text-center md:text-left"
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

        <div className="grid grid-cols-2 mt-16 md:mt-16 gap-4 md:mr-12 mx-auto md:mx-auto max-w-[400px] md:max-w-none">
          {currentHero.map((movie, index) => (
            <div key={movie.id || index} className={index === 0 ? "" : ""}>
              <img
                src={
                  movie.poster_path && movie.poster_path.startsWith("/")
                    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                    : movie.poster_path
                }
                alt={movie.title}
                className="w-[250px] h-auto rounded-t-lg"
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  // Fallback to original SVG if TMDB image fails
                  const fallbackImages = [
                    "lion-king.svg",
                    "expendables.svg",
                    "spiderman.svg",
                    "roblox.svg",
                  ];
                  e.target.src = fallbackImages[index] || "spiderman.svg";
                }}
              />
            </div>
          ))}
        </div>
      </section>

     <section id="reason" className="mt-8 md:mt-24 flex justify-center md:justify-center">
        <div className="rsn my-12 mx-4 md:my-24 md:mx-20 text-center md:text-left">
            <div className="choose text-[#1D4ED8] font-bold mb-4 md:mb-8 text-center">
                <p>WHY CHOOSE US</p>
            </div>
            <div className="tagline font-normal text-[#121212] text-3xl md:text-[31px] mb-8 md:mb-8 flex flex-wrap justify-center md:justify-center">
                <p className="w-full flex justify-center md:w-auto text-center md:text-center mb-12 text-[47px]">Unleashing the Ultimate Movie Experience</p>
            </div>
            <div className="flex flex-col md:flex-row justify-start items-center gap-12 md:gap-12 text-justify">
                <div className="benefit-guarantee flex flex-col items-center text-center max-w-[280px] w-full">
                    <div><img src="guaranteed.svg" alt="guaranteed" className="mb-4"/></div>
                    <div className="step-number font-bold text-lg mb-4 text-center">Guaranteed</div>
                    <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px]">Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.</div>
                </div>
                <div className="benefit-check flex flex-col items-center text-center max-w-[280px] w-full">
                    <img src="check-circle-fill.svg" alt="check" className="p-4 bg-[rgba(29,78,216,0.2)] rounded-full mb-4"/>
                    <div className="step-number font-bold text-lg mb-4 text-center">Affordable</div>
                    <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px]">Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.</div>
                </div>
                <div className="benefit-service flex flex-col items-center text-center max-w-[280px] w-full">
                    <img src="247.svg" alt="24/7" className="mb-4"/>
                    <div className="step-number font-bold text-lg mb-4 text-">24/7 Customer Support</div>
                    <div className="benefit-text text-[#A0A3BD] text-lg text-justify leading-relaxed max-w-[250px]">Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.</div>
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
        <div className="img-container flex flex-col md:flex-row gap-4 max-w-full justify-center items-center pb-4 md:pb-0">
          {currentNowPlaying.map((movie, index) => {
            const genres = getGenreNames(movie.genre_ids);
            const fallbackImages = [
              "blackwidow.svg",
              "tenet.svg",
              "the-witch.svg",
              "spiderman-film.svg",
            ];
            return (
              <div
                key={movie.id || index}
                className="text-center md:max-w-[300px] w-full relative rounded-lg"
              >
                {isRecommended(movie) && (
                  <div className="absolute top-2 left-2 z-10 bg-[#1D4ED8] text-white px-2 py-1 rounded-full text-xs font-bold">
                    Recommended
                  </div>
                )}
                <img
                  src={
                    movie.poster_path && movie.poster_path.startsWith("/")
                      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                      : movie.poster_path
                  }
                  alt={movie.title}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.log("Image failed to load:", e.target.src);
                    e.target.src = fallbackImages[index] || "blackwidow.svg";
                  }}
                />
                <div className="title font-bold mt-4 mb-4">{movie.title}</div>
                <div className="genre flex gap-4 justify-center">
                  {genres.map((genre, genreIndex) => (
                    <div key={genreIndex}>
                      <p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">
                        {genre}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="container-movie .img-container mb-32"></div>
        <div className="view flex justify-center mt-8 w-full">
          <a
            href="home.html"
            className="flex justify-center items-center gap-2 no-underline font-bold text-[#1D4ED8] text-lg mb-8"
          >
            View All <img src="/arrow-right.svg" alt="arrow right" />
          </a>
        </div>
      </section>

      <section id="upcoming-movie" className="mx-4 md:mx-20">
        <div className="container">
          <div className="section-title text-[#1D4ED8] font-bold mb-4 text-center md:text-left">
            <p>UPCOMING MOVIE</p>
          </div>
          <div className="up-movie flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div>
              <p className="font-normal text-[#121212] md:text-[47px] mb-4 md:mb-8">
                Exciting Movie Coming Soon
              </p>
            </div>
            <div className="arrow flex justify-center items-center gap-2 mb-8 md:mb-0">
              <div className="arrow-left bg-[#A0A3BD] p-3 rounded-full cursor-pointer">
                <img src="arrow-left.svg" alt="" />
              </div>
              <div className="arrow-right bg-[#1D4ED8] text-white p-3 rounded-full cursor-pointer">
                <img src="arrow-up.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="img-container flex flex-row gap-4 pb-4 overflow-x-scroll lg:overflow-x-hidden">
            {currentUpcoming.map((movie, index) => {
              const genres = getGenreNames(movie.genre_ids);
              const fallbackImages = [
                "blackwidow.svg",
                "tenet.svg",
                "the-witch.svg",
                "spiderman-film.svg",
              ];
              return (
                <div
                  key={movie.id || index}
                  className="flex-shrink-0 w-[300px] text-center relative"
                >
                  {isRecommended(movie) && (
                    <div className="absolute top-2 left-2 z-10 bg-[#1D4ED8] text-white px-2 py-1 rounded-full text-xs font-bold">
                      Recommended
                    </div>
                  )}
                  <img
                    src={
                      movie.poster_path && movie.poster_path.startsWith("/")
                        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                        : movie.poster_path
                    }
                    alt={movie.title}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      e.target.src = fallbackImages[index] || "blackwidow.svg";
                    }}
                  />
                  <div className="date font-bold text-[#1D4ED8] mb-2">
                    {movie.release_date
                      ? formatReleaseDate(movie.release_date)
                      : "February 2024"}
                  </div>
                  <div className="title font-bold mb-4">{movie.title}</div>
                  <div className="genre flex gap-4 justify-center">
                    {genres.map((genre, genreIndex) => (
                      <div key={genreIndex}>
                        <p className="py-2 px-4 bg-[rgba(160,163,189,0.1)] rounded-full text-xs text-[#A0A3BD]">
                          {genre}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <NewsletterSubscribe/>

      <MyFooter />
    </>
  );
};

export default SectionHome;
