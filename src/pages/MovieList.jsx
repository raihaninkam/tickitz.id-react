import { useState, useEffect } from "react";
import {
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  X,
  Save,
} from "lucide-react";
import NavbarAdmin from "../components/NavbarAdmin";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingMovie, setViewingMovie] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("November 2023");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const months = [
    "January 2023",
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
    "July 2023",
    "August 2023",
    "September 2023",
    "October 2023",
    "November 2023",
    "December 2023",
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + itemsPerPage);
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // Fetch all movies from backend
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/admin/movies`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Transform backend data to match frontend structure
        const transformedMovies = data.data.map((movie) => ({
          id: movie.id,
          thumbnail: movie.poster_image || "/api/placeholder/60/60",
          movieName: movie.title,
          category: movie.genres || "N/A",
          releasedDate: movie.release_date
            ? new Date(movie.release_date).toISOString().split("T")[0]
            : "",
          duration: movie.duration_minutes
            ? `${Math.floor(movie.duration_minutes / 60)} Hours ${
                movie.duration_minutes % 60
              } Minutes`
            : "N/A",
          directorName: movie.director_name || "N/A",
          cast: "N/A", // This field doesn't exist in your backend model
          synopsis: movie.synopsis || "N/A",
          location: "N/A",
          showDate: "N/A",
          showTime: "N/A", // This field doesn't exist in your backend model
          // Backend specific fields
          directorsId: movie.directors_id,
          rating: movie.rating,
          bgPath: movie.bg_path,
          durationMinutes: movie.duration_minutes,
        }));

        setMovies(transformedMovies);
      } else {
        toast.error(data.error || "Failed to fetch movies");
      }
    } catch (error) {
      console.error("Fetch movies error:", error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // Load movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  const handleAddNew = () => {
    navigate("/movieForm");
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setEditForm({
      title: movie.movieName,
      synopsis: movie.synopsis,
      duration_minutes: movie.durationMinutes,
      release_date: movie.releasedDate,
      poster_image: movie.thumbnail,
      directors_id: movie.directorsId,
      rating: movie.rating,
      bg_path: movie.bgPath,
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.title || !editForm.synopsis || !editForm.release_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create update payload with only changed fields
      const updatePayload = {};

      if (editForm.title !== editingMovie.movieName)
        updatePayload.title = editForm.title;
      if (editForm.synopsis !== editingMovie.synopsis)
        updatePayload.synopsis = editForm.synopsis;
      if (editForm.duration_minutes !== editingMovie.durationMinutes)
        updatePayload.duration_minutes = editForm.duration_minutes;
      if (editForm.release_date !== editingMovie.releasedDate)
        updatePayload.release_date = editForm.release_date;
      if (editForm.poster_image !== editingMovie.thumbnail)
        updatePayload.poster_image = editForm.poster_image;
      if (editForm.directors_id !== editingMovie.directorsId)
        updatePayload.directors_id = editForm.directors_id;
      if (editForm.rating !== editingMovie.rating)
        updatePayload.rating = editForm.rating;
      if (editForm.bg_path !== editingMovie.bgPath)
        updatePayload.bg_path = editForm.bg_path;

      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/admin/movies/${editingMovie.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Movie updated successfully!");
        await fetchMovies(); // Refresh the movie list
        setEditingMovie(null);
        setEditForm({});
      } else {
        toast.error(data.error || "Failed to update movie");
      }
    } catch (error) {
      console.error("Update movie error:", error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setEditForm({});
  };

  const handleDelete = async (id) => {
    const movieToDelete = movies.find((movie) => movie.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete "${movieToDelete?.movieName}"?`
      )
    ) {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BE_HOST}/admin/movies/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              // Add authorization header if needed
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Movie deleted successfully!");
          await fetchMovies(); // Refresh the movie list

          // Adjust current page if necessary
          const newTotalPages = Math.ceil((movies.length - 1) / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
        } else {
          toast.error(data.error || "Failed to delete movie");
        }
      } catch (error) {
        console.error("Delete movie error:", error);
        toast.error("Terjadi kesalahan server");
      } finally {
        setLoading(false);
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
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
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
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Movie Title *
                </label>
                <input
                  type="text"
                  value={editForm.title || ""}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter movie title"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  value={editForm.duration_minutes || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "duration_minutes",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 120"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={editForm.release_date || ""}
                  onChange={(e) =>
                    handleFormChange("release_date", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director ID
                </label>
                <input
                  type="number"
                  value={editForm.directors_id || ""}
                  onChange={(e) =>
                    handleFormChange("directors_id", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter director ID"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editForm.rating || ""}
                  onChange={(e) =>
                    handleFormChange("rating", parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8.5"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={editForm.poster_image || ""}
                  onChange={(e) =>
                    handleFormChange("poster_image", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/poster.jpg"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Path
              </label>
              <input
                type="text"
                value={editForm.bg_path || ""}
                onChange={(e) => handleFormChange("bg_path", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Background image path"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Synopsis *
              </label>
              <textarea
                value={editForm.synopsis || ""}
                onChange={(e) => handleFormChange("synopsis", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter movie synopsis..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 disabled:opacity-50"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading overlay
  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarAdmin />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading movies...</div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">
                  Movie Details
                </h1>
              </div>
            </div>

            {/* Movie Details */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <img
                  src={viewingMovie.thumbnail || "/spiderman-sear.svg"}
                  alt="Movie thumbnail"
                  className="w-16 h-16 rounded object-cover border mx-auto sm:mx-0"
                />
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-xl">
                    {viewingMovie.movieName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {viewingMovie.category}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">
                      Release Date:
                    </span>
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
                    <span className="font-medium text-gray-700">Rating:</span>
                    <p className="text-gray-900">
                      {viewingMovie.rating || "N/A"}
                    </p>
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
                <p className="mt-2 text-gray-900 text-sm leading-relaxed">
                  {viewingMovie.synopsis}
                </p>
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
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                List Movie
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="w-full sm:w-auto flex items-center justify-between space-x-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
                    disabled={loading}
                  >
                    <span className="text-gray-600 text-sm sm:text-base">
                      {selectedMonth}
                    </span>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 text-sm sm:text-base disabled:opacity-50"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Movies</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading indicator for actions */}
          {loading && movies.length > 0 && (
            <div className="px-6 py-2 bg-blue-50 border-b border-gray-200">
              <div className="text-sm text-blue-600">Processing...</div>
            </div>
          )}

          {/* Mobile Card View */}
          <div className="block sm:hidden">
            {currentMovies.map((movie) => (
              <div key={movie.id} className="border-b border-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <img
                    src={movie.thumbnail || "/spiderman-sear.svg"}
                    alt={movie.movieName}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-blue-600 font-medium text-sm truncate">
                      {movie.movieName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {movie.category}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Released:</span>
                        <span className="font-medium">
                          {movie.releasedDate}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{movie.duration}</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-1 mt-3">
                      <button
                        onClick={() => handleView(movie)}
                        className="bg-blue-100 text-blue-600 p-1.5 rounded hover:bg-blue-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-purple-100 text-purple-600 p-1.5 rounded hover:bg-purple-200 disabled:opacity-50"
                        disabled={loading}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200 disabled:opacity-50"
                        disabled={loading}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Released Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
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
                        src={movie.thumbnail || "/spiderman-sear.svg"}
                        alt={movie.movieName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-blue-600 font-medium">
                        {movie.movieName}
                      </span>
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
                        <button
                          onClick={() => handleView(movie)}
                          className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 disabled:opacity-50"
                          disabled={loading}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="bg-purple-100 text-purple-600 p-2 rounded hover:bg-purple-200 disabled:opacity-50"
                          disabled={loading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 disabled:opacity-50"
                          disabled={loading}
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

          {/* Empty state */}
          {movies.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No movies found</p>
            </div>
          )}

          {/* Pagination */}
          {movies.length > 0 && (
            <div className="px-3 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex justify-center space-x-1 sm:space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-2 rounded text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      <EditModal />
    </div>
  );
};

export default MovieList;
