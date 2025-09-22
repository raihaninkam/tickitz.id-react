import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import NavbarAdmin from "../components/NavbarAdmin";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const MovieForm = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    duration_minutes: "",
    release_date: "",
    directors_id: "",
    rating: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (movieId) {
      setIsEditing(true);
      fetchMovieForEdit(movieId);
    }
  }, [movieId]);

  const fetchMovieForEdit = async (id) => {
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
        const movie = data.data.find((m) => m.id === parseInt(id));
        if (movie) {
          setFormData({
            title: movie.title || "",
            synopsis: movie.synopsis || "",
            duration_minutes: movie.duration_minutes?.toString() || "",
            release_date: movie.release_date
              ? new Date(movie.release_date).toISOString().split("T")[0]
              : "",
            directors_id: movie.directors_id?.toString() || "",
            rating: movie.rating?.toString() || "",
          });
        } else {
          toast.error("Movie not found");
          navigate("/movieList");
        }
      } else {
        toast.error(data.error || "Failed to fetch movie");
        navigate("/movieList");
      }
    } catch (error) {
      console.error("Fetch movie error:", error);
      toast.error("Terjadi kesalahan server");
      navigate("/movieList");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, setFileFunction) => {
    const file = e.target.files[0];
    if (file) {
      setFileFunction(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Movie title is required";
    }

    if (!formData.synopsis.trim()) {
      newErrors.synopsis = "Synopsis is required";
    }

    if (!formData.duration_minutes) {
      newErrors.duration_minutes = "Duration is required";
    } else if (parseInt(formData.duration_minutes) <= 0) {
      newErrors.duration_minutes = "Duration must be positive";
    }

    if (!formData.release_date) {
      newErrors.release_date = "Release date is required";
    }

    if (!formData.directors_id) {
      newErrors.directors_id = "Director ID is required";
    } else if (parseInt(formData.directors_id) <= 0) {
      newErrors.directors_id = "Director ID must be greater than 0";
    }

    if (
      formData.rating &&
      (parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 10)
    ) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    // For new movies, require poster image
    if (!isEditing && !posterFile) {
      newErrors.poster_image = "Poster image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("synopsis", formData.synopsis);
      formDataToSend.append("duration_minutes", formData.duration_minutes);
      formDataToSend.append("release_date", formData.release_date);
      formDataToSend.append("directors_id", formData.directors_id);
      if (formData.rating) {
        formDataToSend.append("rating", formData.rating);
      }

      // Add files
      if (posterFile) {
        formDataToSend.append("poster_image", posterFile);
      }
      if (bgFile) {
        formDataToSend.append("bg_path", bgFile);
      }

      let url, method, successMessage;

      if (isEditing) {
        url = `${import.meta.env.VITE_BE_HOST}/admin/movies/${movieId}`;
        method = "PATCH";
        successMessage = "Movie updated successfully!";
      } else {
        url = `${import.meta.env.VITE_BE_HOST}/admin/movies/add`;
        method = "POST";
        successMessage = "Movie added successfully!";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(successMessage);

        if (!isEditing) {
          // Reset form for new movies
          setFormData({
            title: "",
            synopsis: "",
            duration_minutes: "",
            release_date: "",
            directors_id: "",
            rating: "",
          });
          setPosterFile(null);
          setBgFile(null);
        }

        setTimeout(() => {
          navigate("/movieList");
        }, 1500);
      } else {
        toast.error(
          data.error || `Failed to ${isEditing ? "update" : "add"} movie`
        );
      }
    } catch (error) {
      console.error(`${isEditing ? "Update" : "Add"} movie error:`, error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/movieList");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900"
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to List
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Movie" : "Add New Movie"}
              </h1>
            </div>
          </div>

          {/* Form */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Poster Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poster Image{" "}
                  {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setPosterFile)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
                {errors.poster_image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.poster_image}
                  </p>
                )}
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setBgFile)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Movie Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Spider-Man: Homecoming"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-300" : "border-gray-300"
                }`}
                required
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Synopsis <span className="text-red-500">*</span>
              </label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                placeholder="Movie synopsis..."
                rows="4"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.synopsis ? "border-red-300" : "border-gray-300"
                }`}
                required
                disabled={loading}
              />
              {errors.synopsis && (
                <p className="mt-1 text-sm text-red-600">{errors.synopsis}</p>
              )}
            </div>

            {/* Duration and Release Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  placeholder="120"
                  min="1"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.duration_minutes
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  required
                  disabled={loading}
                />
                {errors.duration_minutes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.duration_minutes}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Release Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.release_date ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                  disabled={loading}
                />
                {errors.release_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.release_date}
                  </p>
                )}
              </div>
            </div>

            {/* Director ID and Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="directors_id"
                  value={formData.directors_id}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.directors_id ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                  disabled={loading}
                />
                {errors.directors_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.directors_id}
                  </p>
                )}
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
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="8.5"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rating ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                disabled={loading}
              >
                <span>
                  {loading
                    ? isEditing
                      ? "Updating..."
                      : "Adding..."
                    : isEditing
                    ? "Update Movie"
                    : "Save Movie"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MovieForm;
