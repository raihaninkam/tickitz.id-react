import { useState } from "react";
import { ChevronDown, Eye, Edit2, Trash2, Plus, ArrowLeft, X, Save } from "lucide-react";
import NavbarAdmin from "../components/NavbarAdmin";
import { useNavigate } from "react-router";

const MovieList = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      thumbnail: "/api/placeholder/60/60",
      movieName: "Spiderman HomeComing",
      category: "Action, Adventure",
      releasedDate: "2023-07-05",
      duration: "2 Hours 15 Minute",
      directorName: "Jon Watts",
      cast: "Tom Holland, Michael Keaton, Robert Downey Jr.",
      synopsis: "Thrilled by his experience with the Avengers, Peter returns home, where he lives with his Aunt May.",
      location: "Purwokerto, Bandung, Bekasi",
      showDate: "2023-07-07",
      showTime: "08:30am",
    },
    {
      id: 2,
      thumbnail: "/api/placeholder/60/60",
      movieName: "Avengers End Game",
      category: "Sci-fi, Adventure",
      releasedDate: "2023-06-10",
      duration: "2 Hours 15 Minute",
      directorName: "Anthony Russo",
      cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
      synopsis: "After the devastating events of Avengers: Infinity War, the universe is in ruins.",
      location: "Jakarta, Surabaya",
      showDate: "2023-06-14",
      showTime: "02:00pm",
    },
  ]);

  const [viewingMovie, setViewingMovie] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("November 2023");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const months = [
    "January 2023", "February 2023", "March 2023", "April 2023",
    "May 2023", "June 2023", "July 2023", "August 2023",
    "September 2023", "October 2023", "November 2023", "December 2023",
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate('/movieForm')
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setEditForm({ ...movie });
  };

  const handleSaveEdit = () => {
    if (!editForm.movieName || !editForm.category || !editForm.releasedDate) {
      alert("Please fill in all required fields");
      return;
    }

    setMovies(prev => prev.map(movie => 
      movie.id === editingMovie.id ? { ...editForm } : movie
    ));
    
    setEditingMovie(null);
    setEditForm({});
    alert("Movie updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    const movieToDelete = movies.find(movie => movie.id === id);
    if (window.confirm(`Are you sure you want to delete "${movieToDelete?.movieName}"?`)) {
      setMovies(prev => prev.filter(movie => movie.id !== id));
      alert("Movie deleted successfully!");
      
      // Adjust current page if necessary
      const newTotalPages = Math.ceil((movies.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleView = (movie) => {
    setViewingMovie(movie);
  };

  const handleBackToList = () => {
    setViewingMovie(null);
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Edit Modal Component
  const EditModal = () => {
    if (!editingMovie) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Edit Movie</h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Movie Name *
                </label>
                <input
                  type="text"
                  value={editForm.movieName || ''}
                  onChange={(e) => handleFormChange('movieName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter movie name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={editForm.category || ''}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Action, Adventure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={editForm.releasedDate || ''}
                  onChange={(e) => handleFormChange('releasedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={editForm.duration || ''}
                  onChange={(e) => handleFormChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 Hours 15 Minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director Name
                </label>
                <input
                  type="text"
                  value={editForm.directorName || ''}
                  onChange={(e) => handleFormChange('directorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter director name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show Date
                </label>
                <input
                  type="date"
                  value={editForm.showDate || ''}
                  onChange={(e) => handleFormChange('showDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show Time
                </label>
                <input
                  type="time"
                  value={editForm.showTime?.replace(/am|pm/i, '') || ''}
                  onChange={(e) => handleFormChange('showTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Jakarta, Surabaya"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cast
              </label>
              <input
                type="text"
                value={editForm.cast || ''}
                onChange={(e) => handleFormChange('cast', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Synopsis
              </label>
              <textarea
                value={editForm.synopsis || ''}
                onChange={(e) => handleFormChange('synopsis', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter movie synopsis..."
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Movie Details View
  if (viewingMovie) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarAdmin />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to List
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Movie Details</h1>
              </div>
            </div>

            {/* Movie Details */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <img
                  src="/spiderman-sear.svg"
                  alt="Movie thumbnail"
                  className="w-16 h-16 rounded object-cover border mx-auto sm:mx-0"
                />
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-xl">{viewingMovie.movieName}</h4>
                  <p className="text-sm text-gray-500">{viewingMovie.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Release Date:</span>
                    <p className="text-gray-900">{viewingMovie.releasedDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-900">{viewingMovie.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Director:</span>
                    <p className="text-gray-900">{viewingMovie.directorName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Show Date:</span>
                    <p className="text-gray-900">{viewingMovie.showDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Show Time:</span>
                    <p className="text-gray-900">{viewingMovie.showTime}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Cast:</span>
                    <p className="text-gray-900">{viewingMovie.cast}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-900">{viewingMovie.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-700">Synopsis:</span>
                <p className="mt-2 text-gray-900 text-sm leading-relaxed">{viewingMovie.synopsis}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Page Header */}
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">List Movie</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="w-full sm:w-auto flex items-center justify-between space-x-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
                  >
                    <span className="text-gray-600 text-sm sm:text-base">{selectedMonth}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showMonthDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border rounded-lg shadow-lg z-10">
                      {months.map((month) => (
                        <button
                          key={month}
                          onClick={() => {
                            setSelectedMonth(month);
                            setShowMonthDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddNew}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Movies</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {currentMovies.map((movie) => (
              <div key={movie.id} className="border-b border-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <img
                    src="/spiderman-sear.svg"
                    alt={movie.movieName}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-blue-600 font-medium text-sm truncate">{movie.movieName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{movie.category}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Released:</span>
                        <span className="font-medium">{movie.releasedDate}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{movie.duration}</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-1 mt-3">
                      <button
                        onClick={() => handleView(movie)}
                        className="bg-blue-100 text-blue-600 p-1.5 rounded hover:bg-blue-200"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-purple-100 text-purple-600 p-1.5 rounded hover:bg-purple-200"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src="/spiderman-sear.svg"
                        alt={movie.movieName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">{movie.movieName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.releasedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movie.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(movie)}
                          className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                        >
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
          <div className="px-3 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex justify-center space-x-1 sm:space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 sm:px-3 py-2 rounded text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <EditModal />
    </div>
  );
};

export default MovieList;