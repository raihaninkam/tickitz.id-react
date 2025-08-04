import { useState } from 'react';
import { Search, User, ChevronDown, Eye, Edit2, Trash2, Plus, X } from 'lucide-react';
import NavbarDashboard from '../components/NavbarDashboard';

const TickitzMovieCRUD = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      thumbnail: '/api/placeholder/60/60',
      movieName: 'Spiderman HomeComing',
      category: 'Action, Adventure',
      releasedDate: '07/05/2023',
      duration: '2 Hours 15 Minute'
    },
    {
      id: 2,
      thumbnail: '/api/placeholder/60/60',
      movieName: 'Avengers End Game',
      category: 'Sci-fi, Adventure',
      releasedDate: '10/06/2023',
      duration: '2 Hours 15 Minute'
    },
    {
      id: 3,
      thumbnail: '/api/placeholder/60/60',
      movieName: 'Spiderman HomeComing',
      category: 'Action, Adventure',
      releasedDate: '02/03/2023',
      duration: '2 Hours 15 Minute'
    },
    {
      id: 4,
      thumbnail: '/api/placeholder/60/60',
      movieName: 'Avengers End Game',
      category: 'Sci-fi, Adventure',
      releasedDate: '01/09/2023',
      duration: '2 Hours 15 Minute'
    },
    {
      id: 5,
      thumbnail: '/api/placeholder/60/60',
      movieName: 'Spiderman HomeComing',
      category: 'Action, Adventure',
      releasedDate: '07/08/2023',
      duration: '2 Hours 15 Minute'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('November 2023');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [formData, setFormData] = useState({
    movieName: '',
    category: '',
    releasedDate: '',
    duration: '',
    hours: '',
    minutes: '',
    directorName: '',
    cast: '',
    synopsis: '',
    location: '',
    showDate: '',
    showTime: '08:30am',
    thumbnail: '/api/placeholder/60/60'
  });

  const months = [
    'January 2023', 'February 2023', 'March 2023', 'April 2023',
    'May 2023', 'June 2023', 'July 2023', 'August 2023',
    'September 2023', 'October 2023', 'November 2023', 'December 2023'
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.movieName || !formData.category || !formData.releasedDate || !formData.hours || !formData.minutes) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Combine hours and minutes for duration
    const duration = `${formData.hours} Hours ${formData.minutes} Minute`;
    
    if (editingMovie) {
      // Update existing movie
      setMovies(prev => prev.map(movie => 
        movie.id === editingMovie.id 
          ? { ...formData, id: editingMovie.id, duration }
          : movie
      ));
    } else {
      // Create new movie
      const newMovie = {
        ...formData,
        id: Math.max(...movies.map(m => m.id)) + 1,
        duration
      };
      setMovies(prev => [...prev, newMovie]);
    }

    // Reset form and close modal
    setFormData({
      movieName: '',
      category: '',
      releasedDate: '',
      duration: '',
      hours: '',
      minutes: '',
      directorName: '',
      cast: '',
      synopsis: '',
      location: '',
      showDate: '',
      showTime: '08:30am',
      thumbnail: '/api/placeholder/60/60'
    });
    setShowModal(false);
    setEditingMovie(null);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    // Parse duration back to hours and minutes
    const durationParts = movie.duration.match(/(\d+)\s*Hours?\s*(\d+)\s*Minutes?/i);
    const hours = durationParts ? durationParts[1] : '';
    const minutes = durationParts ? durationParts[2] : '';
    
    setFormData({
      movieName: movie.movieName,
      category: movie.category,
      releasedDate: movie.releasedDate,
      duration: movie.duration,
      hours,
      minutes,
      directorName: movie.directorName || '',
      cast: movie.cast || '',
      synopsis: movie.synopsis || '',
      location: movie.location || '',
      showDate: movie.showDate || '',
      showTime: movie.showTime || '08:30am',
      thumbnail: movie.thumbnail
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      setMovies(prev => prev.filter(movie => movie.id !== id));
    }
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    setFormData({
      movieName: '',
      category: '',
      releasedDate: '',
      duration: '',
      hours: '',
      minutes: '',
      directorName: '',
      cast: '',
      synopsis: '',
      location: '',
      showDate: '',
      showTime: '08:30am',
      thumbnail: '/api/placeholder/60/60'
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavbarDashboard/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Page Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">List Movie</h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="flex items-center space-x-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-gray-600">{selectedMonth}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showMonthDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                      {months.map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setSelectedMonth(month);
                            setShowMonthDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddNew}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Movies</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Released Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMovies.map((movie, index) => (
                  <tr key={movie.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={movie.thumbnail}
                        alt={movie.movieName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href="#" className="text-blue-600 hover:text-blue-900 font-medium">
                        {movie.movieName}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movie.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movie.releasedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movie.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="bg-purple-100 text-purple-600 p-2 rounded hover:bg-purple-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.thumbnail}
                    alt="Movie thumbnail"
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Upload
                  </button>
                </div>
              </div>

              {/* Movie Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Movie Name
                </label>
                <input
                  type="text"
                  name="movieName"
                  value={formData.movieName}
                  onChange={handleInputChange}
                  placeholder="Spider-Man: Homecoming"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Action, Adventure, Sci-Fi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Release Date and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release date
                  </label>
                  <input
                    type="date"
                    name="releasedDate"
                    value={formData.releasedDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hour / minute)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleInputChange}
                      placeholder="2"
                      min="0"
                      max="5"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="minutes"
                      value={formData.minutes}
                      onChange={handleInputChange}
                      placeholder="13"
                      min="0"
                      max="59"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Director Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director Name
                </label>
                <input
                  type="text"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleInputChange}
                  placeholder="Jon Watts"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cast */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cast
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  placeholder="Tom Holland, Michael Keaton, Robert Dow..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Synopsis
                </label>
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleInputChange}
                  placeholder="Thrilled by his experience with the Avengers, Peter returns home, where he lives with his Aunt May..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Add Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Purwokerto, Bandung, Bekasi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Set Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Date & Time
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      name="showDate"
                      value={formData.showDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">Set a date</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 border-2 border-dashed border-blue-600 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50">
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="flex space-x-2">
                      <span className="bg-gray-100 px-3 py-1 rounded text-sm">08:30am</span>
                      <span className="bg-gray-100 px-3 py-1 rounded text-sm">10:30pm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Save Movie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TickitzMovieCRUD;