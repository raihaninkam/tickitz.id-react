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
  Calendar,
  Clock,
  MapPin,
  Film,
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
  const [editPosterFile, setEditPosterFile] = useState(null);
  const [editBgFile, setEditBgFile] = useState(null);
  const [editShowtimes, setEditShowtimes] = useState([]);

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
        const getImageUrl = (path) => {
          if (!path) return "/api/placeholder/60/60";
          if (path.startsWith("http")) return path;
          return `${import.meta.env.VITE_BE_HOST}${path}`;
        };

        // Transform backend data
        const transformedMovies = data.data.map((movie) => ({
          id: movie.id,
          thumbnail: getImageUrl(movie.poster_image),
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
          cast: "N/A",
          synopsis: movie.synopsis || "N/A",
          location: "N/A",
          showDate: "N/A",
          showTime: "N/A",
          directorsId: movie.directors_id,
          rating: movie.rating,
          bgPath: movie.bg_path,
          durationMinutes: movie.duration_minutes,
          genresId: movie.genres_id || [],
          castsId: movie.casts_id || [],
          showtimes: movie.showtimes || [],
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
      directors_id: movie.directorsId || "",
      rating: movie.rating || "",
      genres_id: movie.genresId ? movie.genresId.join(",") : "",
      casts_id: movie.castsId ? movie.castsId.join(",") : "",
    });

    // Set showtimes data
    if (movie.showtimes && movie.showtimes.length > 0) {
      setEditShowtimes(
        movie.showtimes.map((st) => ({
          date: st.date || "",
          time: st.time || "",
          location_id: st.location_id?.toString() || "",
          cinema_id: st.cinema_id?.toString() || "",
        }))
      );
    } else {
      setEditShowtimes([
        { date: "", time: "", location_id: "", cinema_id: "" },
      ]);
    }

    setEditPosterFile(null);
    setEditBgFile(null);
  };

  const handleSaveEdit = async () => {
    // Validasi required fields
    if (
      !editForm.title?.trim() ||
      !editForm.synopsis?.trim() ||
      !editForm.release_date ||
      !editForm.duration_minutes
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validasi showtimes
    const validShowtimes = editShowtimes.filter(
      (st) => st.date && st.time && st.location_id && st.cinema_id
    );

    if (validShowtimes.length === 0) {
      toast.error("Please add at least one valid showtime");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Append semua field yang diperlukan
      formDataToSend.append("title", editForm.title.trim());
      formDataToSend.append("synopsis", editForm.synopsis.trim());
      formDataToSend.append(
        "duration_minutes",
        editForm.duration_minutes.toString()
      );
      formDataToSend.append("release_date", editForm.release_date);

      if (editForm.directors_id) {
        formDataToSend.append("directors_id", editForm.directors_id.toString());
      }

      if (
        editForm.rating !== undefined &&
        editForm.rating !== null &&
        editForm.rating !== ""
      ) {
        formDataToSend.append("rating", editForm.rating.toString());
      }

      // Gunakan genres_id dan casts_id dari editForm
      if (editForm.genres_id) {
        formDataToSend.append("genres_id", editForm.genres_id);
      }

      if (editForm.casts_id) {
        formDataToSend.append("casts_id", editForm.casts_id);
      }

      // Append showtimes data sebagai arrays
      validShowtimes.forEach((showtime) => {
        formDataToSend.append("showtime_dates[]", showtime.date);
        formDataToSend.append("showtime_times[]", showtime.time);
        formDataToSend.append("showtime_location_ids[]", showtime.location_id);
        formDataToSend.append("showtime_cinema_ids[]", showtime.cinema_id);
      });

      // Handle file uploads
      if (editPosterFile) {
        formDataToSend.append("poster_image", editPosterFile);
      }
      if (editBgFile) {
        formDataToSend.append("bg_path", editBgFile);
      }

      console.log("Movie ID:", editingMovie.id);
      console.log("Showtimes:", validShowtimes);

      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/admin/movies/${editingMovie.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      if (response.ok && data.success) {
        toast.success("Movie updated successfully!");
        await fetchMovies();
        setEditingMovie(null);
        setEditForm({});
        setEditShowtimes([]);
        setEditPosterFile(null);
        setEditBgFile(null);
      } else {
        const errorMessage =
          data.error || data.message || "Failed to update movie";
        toast.error(errorMessage);
        console.error("Update error details:", data);
      }
    } catch (error) {
      console.error("Update movie error:", error);
      toast.error(error.message || "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setEditForm({});
    setEditShowtimes([]);
    setEditPosterFile(null);
    setEditBgFile(null);
  };

  // Showtime handlers
  const handleAddShowtime = () => {
    setEditShowtimes((prev) => [
      ...prev,
      { date: "", time: "", location_id: "", cinema_id: "" },
    ]);
  };

  const handleRemoveShowtime = (index) => {
    if (editShowtimes.length > 1) {
      setEditShowtimes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleShowtimeChange = (index, field, value) => {
    setEditShowtimes((prev) =>
      prev.map((showtime, i) =>
        i === index ? { ...showtime, [field]: value } : showtime
      )
    );
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Movie deleted successfully!");
          await fetchMovies();

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

  const handlePosterFileChange = (file) => {
    setEditPosterFile(file);
  };

  const handleBgFileChange = (file) => {
    setEditBgFile(file);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Edit Modal Component
  const EditModal = () => {
    if (!editingMovie) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
          <div className="p-6 space-y-6">
            {/* Basic Information */}
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
                      parseInt(e.target.value) || ""
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
                    handleFormChange(
                      "directors_id",
                      parseInt(e.target.value) || ""
                    )
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
                    handleFormChange("rating", parseFloat(e.target.value) || "")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8.5"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre IDs (comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.genres_id || ""}
                  onChange={(e) =>
                    handleFormChange("genres_id", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1,2,3"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cast IDs (comma separated)
                </label>
                <input
                  type="text"
                  value={editForm.casts_id || ""}
                  onChange={(e) => handleFormChange("casts_id", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1,2,3"
                  disabled={loading}
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poster Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handlePosterFileChange(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={loading}
                />
                {editPosterFile && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ {editPosterFile.name}
                  </p>
                )}
                {editingMovie.thumbnail && !editPosterFile && (
                  <p className="mt-1 text-xs text-gray-500">
                    Current: {editingMovie.thumbnail.split("/").pop()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleBgFileChange(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={loading}
                />
                {editBgFile && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ {editBgFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Synopsis */}
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

            {/* Showtimes Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Showtimes</h4>
                <button
                  type="button"
                  onClick={handleAddShowtime}
                  className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Showtime</span>
                </button>
              </div>

              <div className="space-y-4">
                {editShowtimes.map((showtime, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Showtime {index + 1}
                      </span>
                      {editShowtimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveShowtime(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Date
                        </label>
                        <input
                          type="date"
                          value={showtime.date}
                          onChange={(e) =>
                            handleShowtimeChange(index, "date", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Time
                        </label>
                        <input
                          type="time"
                          value={showtime.time}
                          onChange={(e) =>
                            handleShowtimeChange(index, "time", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          Location ID
                        </label>
                        <input
                          type="number"
                          value={showtime.location_id}
                          onChange={(e) =>
                            handleShowtimeChange(
                              index,
                              "location_id",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Location ID"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 flex items-center">
                          <Film className="w-3 h-3 mr-1" />
                          Cinema ID
                        </label>
                        <input
                          type="number"
                          value={showtime.cinema_id}
                          onChange={(e) =>
                            handleShowtimeChange(
                              index,
                              "cinema_id",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Cinema ID"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

              {/* Showtimes in Details View */}
              {viewingMovie.showtimes && viewingMovie.showtimes.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Showtimes:</span>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {viewingMovie.showtimes.map((showtime, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-md text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{showtime.date}</span>
                          <span className="text-blue-600">{showtime.time}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Location: {showtime.location_id} | Cinema:{" "}
                          {showtime.cinema_id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Movie List
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and view all movies in the system
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddNew}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={movie.thumbnail || "/spiderman-sear.svg"}
                          alt="Movie thumbnail"
                          className="w-10 h-10 rounded object-cover border"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {movie.movieName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movie.category}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movie.releasedDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movie.duration}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(movie)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit Movie"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Movie"
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
          {movies.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, movies.length)} of{" "}
                  {movies.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {movies.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No movies found.</p>
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
