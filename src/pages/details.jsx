import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import MyNavbar from '../components/Navbar';
import MyFooter from '../components/Footer';

const MovieDetailPage = ({ onBookingDataChange }) => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState([]);
  
  // State untuk semua input booking - semua dimulai kosong/null
  const [bookingData, setBookingData] = useState({
    selectedDate: '',
    selectedTime: '',
    selectedLocation: '',
    selectedCinema: null,
    movieId: null,
    movieTitle: '',
    moviePoster: '',
    ticketQuantity: 1
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id);
      fetchMovieCredits(id);
      // Update movieId di booking data
      setBookingData(prev => ({
        ...prev,
        movieId: id
      }));
    }
  }, [id]);

  // Effect untuk mengirim data booking ke parent component
  useEffect(() => {
    if (onBookingDataChange && typeof onBookingDataChange === 'function') {
      onBookingDataChange(bookingData);
    }
  }, [bookingData, onBookingDataChange]);

  const fetchMovieDetail = async (movieId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjlhYWJkYWEyMTYyOWRlOTM0YjI1NjFhYjI2ODBmZCIsIm5iZiI6MTc1MzUzMDgzOS42NjQsInN1YiI6IjY4ODRjMWQ3ZTIwYTNlOGRhYmY3ODU2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YsOcW4dK8ZVpcGKIXE8LSoxWMA8By9zrj6-PuMMQPzw'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch movie details');
      const data = await response.json();
      setMovieData(data);
      
      // Update booking data dengan informasi movie
      setBookingData(prev => ({
        ...prev,
        movieTitle: data.title || '',
        moviePoster: data.poster_path || ''
      }));
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      setMovieData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieCredits = async (movieId) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjlhYWJkYWEyMTYyOWRlOTM0YjI1NjFhYjI2ODBmZCIsIm5iZiI6MTc1MzUzMDgzOS42NjQsInN1YiI6IjY4ODRjMWQ3ZTIwYTNlOGRhYmY3ODU2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YsOcW4dK8ZVpcGKIXE8LSoxWMA8By9zrj6-PuMMQPzw'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch credits');

      const data = await response.json();
      const directorData = data.crew.find((person) => person.job === 'Director');
      setDirector(directorData ? directorData.name : 'Unknown');

      const castNames = data.cast.slice(0, 5).map((actor) => actor.name);
      setCast(castNames);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  // Handler untuk update booking data
  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler untuk memilih cinema
  const handleCinemaSelect = (cinema) => {
    setBookingData(prev => ({
      ...prev,
      selectedCinema: cinema
    }));
  };

  // Handler untuk proses booking - submit data dan navigate ke order page
  const handleBookNow = () => {
    // Validasi data booking
    if (!bookingData.selectedDate) {
      alert('Please select a date!');
      return;
    }
    if (!bookingData.selectedTime) {
      alert('Please select a time!');
      return;
    }
    if (!bookingData.selectedLocation) {
      alert('Please select a location!');
      return;
    }
    if (!bookingData.selectedCinema) {
      alert('Please select a cinema!');
      return;
    }

    // Siapkan data lengkap untuk order page
    const completeBookingData = {
      ...bookingData,
      // Tambahan data untuk order page
      genres: movieData?.genres || [],
      overview: movieData?.overview || '',
      runtime: movieData?.runtime || 0,
      release_date: movieData?.release_date || '',
      director: director,
      cast: cast,
      backdrop_path: movieData?.backdrop_path || ''
    };

    // Pass data ke parent component jika ada callback
    if (onBookingDataChange && typeof onBookingDataChange === 'function') {
      onBookingDataChange(completeBookingData);
    }
    
    // Simpan data ke sessionStorage untuk digunakan di order page
    sessionStorage.setItem('bookingData', JSON.stringify(completeBookingData));
    
    console.log('Complete Booking Data:', completeBookingData);
    
    // Navigate ke order page
    navigate('/home/order');
  };

  const cinemas = [
    { id: 1, name: 'EBV', logo: '/ebv.id 2.svg' },
    { id: 2, name: 'Hiflix', logo: '/hiflix 2.svg' },
    { id: 3, name: 'CineOne21', logo: '/CineOne21 2.svg' },
    { id: 4, name: 'EBV', logo: '/ebv.id 2.svg' }
  ];

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

  if (!movieData) {
    return (
      <div className="min-h-screen bg-white font-['Mulish']">
        <MyNavbar />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">
            Movie not found
          </h3>
          <p className="text-gray-500">
            The requested movie could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Mulish']">
      <MyNavbar />

      <main className="flex flex-col">
        <section 
          className="w-full h-96 bg-cover bg-center relative"
          style={{
            backgroundImage: movieData?.backdrop_path 
              ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://image.tmdb.org/t/p/w1280${movieData.backdrop_path})`
              : 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))',
            backgroundPosition: '15%'
          }}
        />

        <section className="px-4 md:px-32 -mt-35 relative z-10">
          <div className="flex flex-col md:flex-row lg:items-end md:items-center gap-4 mb-8">
            {movieData?.poster_path && (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                alt={movieData.title}
                className="w-64 rounded-lg shadow-lg -mt-1  mx-auto"
              />
            )}

            <div className="flex flex-col gap-4 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white md:text-gray-900">
                {movieData?.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {movieData?.genres?.map((genre) => (
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
                    {movieData?.release_date ?
                      new Date(movieData.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 mb-1">Directed by</h4>
                  <p className="text-gray-900">{director || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 mb-1">Duration</h4>
                  <p className="text-gray-900">
                    {movieData?.runtime ?
                      `${Math.floor(movieData.runtime / 60)} hours ${movieData.runtime % 60} minutes` : 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-400 mb-1">Casts</h4>
                  <p className="text-gray-900">{cast.length > 0 ? cast.join(', ') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
            <p className="text-gray-400 leading-relaxed max-w-4xl">
              {movieData?.overview || 'No synopsis available for this movie.'}
            </p>
          </div>
        </section>

        <section className="px-4 md:px-32 mb-16">
          <h2 className="text-2xl font-bold mb-6">Book Tickets</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div>
              <h4 className="mb-2 font-bold">Choose Date</h4>
              <select 
                value={bookingData.selectedDate} 
                onChange={(e) => handleInputChange('selectedDate', e.target.value)} 
                className="w-full p-3 bg-gray-100 rounded-lg border-0 text-gray-700"
              >
                <option value="">Choose Date</option>
                <option value="21/07/20">21/07/20</option>
                <option value="22/07/20">22/07/20</option>
                <option value="23/07/20">23/07/20</option>
                <option value="24/07/20">24/07/20</option>
                <option value="25/07/20">25/07/20</option>
              </select>
            </div>
            <div>
              <h4 className="font-bold mb-2">Choose Time</h4>
              <select 
                value={bookingData.selectedTime} 
                onChange={(e) => handleInputChange('selectedTime', e.target.value)} 
                className="w-full p-3 bg-gray-100 rounded-lg border-0 text-gray-700"
              >
                <option value="">Choose Time</option>
                <option value="08:30 AM">08:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>
            <div>
              <h4 className="font-bold mb-2">Choose Location</h4>
              <select 
                value={bookingData.selectedLocation} 
                onChange={(e) => handleInputChange('selectedLocation', e.target.value)} 
                className="w-full p-3 bg-gray-100 rounded-lg border-0 text-gray-700"
              >
                <option value="">Choose Location</option>
                <option value="Purwokerto">Purwokerto</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Yogyakarta">Yogyakarta</option>
              </select>
            </div>
            <div>
              <h4 className="font-bold mb-2">Ticket Quantity</h4>
              <select 
                value={bookingData.ticketQuantity} 
                onChange={(e) => handleInputChange('ticketQuantity', parseInt(e.target.value))} 
                className="w-full p-3 bg-gray-100 rounded-lg border-0 text-gray-700"
              >
                <option value={1}>1 Ticket</option>
                <option value={2}>2 Tickets</option>
                <option value={3}>3 Tickets</option>
                <option value={4}>4 Tickets</option>
                <option value={5}>5 Tickets</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Filter
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <h4 className="font-bold">Choose Cinema</h4>
              <h4 className="text-gray-500">39 Result</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {cinemas.map((cinema) => (
                <div 
                  key={cinema.id} 
                  onClick={() => handleCinemaSelect(cinema)}
                  className={`flex items-center justify-center h-28 border-2 rounded-lg cursor-pointer transition-all ${
                    bookingData.selectedCinema?.id === cinema.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center w-full px-4">
                    <img src={cinema.logo} className="h-10 object-contain mb-2" alt={cinema.name} />
                    <span className="text-sm text-gray-600">{cinema.name}</span>
                  </div>
                </div>
              ))}
            </div>
            

            <div className="flex justify-center">
              <button 
                onClick={handleBookNow}
                className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!bookingData.selectedDate || !bookingData.selectedTime || !bookingData.selectedLocation || !bookingData.selectedCinema}
              >
                Book Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <MyFooter />
    </div>
  );
};

export default MovieDetailPage;