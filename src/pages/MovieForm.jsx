import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import NavbarAdmin from "../components/NavbarAdmin";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const MovieForm = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [showtimeData, setShowtimeData] = useState([
    { date: "", time: "", location_id: "", cinema_id: "" },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    genres_id: "",
    release_date: "",
    duration_minutes: "",
    directors_id: "",
    casts_id: "",
    synopsis: "",
    rating: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const { token } = useSelector((state) => state.auth);

  // Reset function - DIPINDAHKAN ke atas sebelum useEffect
  const resetForm = () => {
    setFormData({
      title: "",
      genres_id: "",
      release_date: "",
      duration_minutes: "",
      directors_id: "",
      casts_id: "",
      synopsis: "",
      rating: "",
    });
    setShowtimeData([{ date: "", time: "", location_id: "", cinema_id: "" }]);
    setPosterFile(null);
    setBgFile(null);
  };

  useEffect(() => {
    if (movieId) {
      setIsEditing(true);
      fetchMovieForEdit(movieId);
    } else {
      resetForm();
    }
  }, [movieId]);

  const fetchMovieForEdit = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/movies/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie");
      }

      const data = await response.json();

      if (data.success) {
        const movie = data.data;

        // Format data untuk form editing
        setFormData({
          title: movie.title || "",
          genres_id: Array.isArray(movie.genres)
            ? movie.genres.map((g) => g.id).join(",")
            : "",
          release_date: movie.release_date
            ? new Date(movie.release_date).toISOString().split("T")[0]
            : "",
          duration_minutes: movie.duration_minutes?.toString() || "",
          directors_id: movie.director?.id?.toString() || "",
          casts_id: Array.isArray(movie.casts)
            ? movie.casts.map((c) => c.id).join(",")
            : "",
          synopsis: movie.synopsis || "",
          rating: movie.rating?.toString() || "",
        });

        // Jika ada showtimes, format juga
        if (movie.showtimes && Array.isArray(movie.showtimes)) {
          const formattedShowtimes = movie.showtimes.map((st) => ({
            date: st.date || "",
            time: st.time || "",
            location_id: st.location_id?.toString() || "",
            cinema_id: st.cinema_id?.toString() || "",
          }));
          setShowtimeData(
            formattedShowtimes.length > 0
              ? formattedShowtimes
              : [{ date: "", time: "", location_id: "", cinema_id: "" }]
          );
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

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG, PNG, GIF, or WebP");
        return;
      }

      setPosterFile(file);
      if (errors.poster_image) {
        setErrors((prev) => ({ ...prev, poster_image: "" }));
      }
    }
  };

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload JPEG, PNG, GIF, or WebP");
        return;
      }

      setBgFile(file);
    }
  };

  const handleShowtimeChange = (index, field, value) => {
    const newShowtimes = [...showtimeData];
    newShowtimes[index] = { ...newShowtimes[index], [field]: value };
    setShowtimeData(newShowtimes);
  };

  const handleAddShowtime = () => {
    setShowtimeData([
      ...showtimeData,
      { date: "", time: "", location_id: "", cinema_id: "" },
    ]);
  };

  const handleRemoveShowtime = (index) => {
    if (showtimeData.length > 1) {
      const newShowtimes = showtimeData.filter((_, i) => i !== index);
      setShowtimeData(newShowtimes);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = "Movie title is required";
    }

    if (!formData.genres_id.trim()) {
      newErrors.genres_id = "Genre ID is required";
    } else {
      // Validate genres_id format (comma separated numbers)
      const genresArray = formData.genres_id.split(",").map((g) => g.trim());
      const invalidGenres = genresArray.filter((g) => !g || isNaN(parseInt(g)));
      if (invalidGenres.length > 0) {
        newErrors.genres_id = "Genre IDs must be numbers separated by commas";
      }
    }

    if (!formData.release_date) {
      newErrors.release_date = "Release date is required";
    }

    if (
      !formData.duration_minutes ||
      isNaN(formData.duration_minutes) ||
      parseInt(formData.duration_minutes) <= 0
    ) {
      newErrors.duration_minutes = "Valid duration in minutes is required";
    }

    if (!formData.directors_id.trim() || isNaN(formData.directors_id)) {
      newErrors.directors_id = "Valid Director ID is required";
    }

    if (!formData.synopsis.trim()) {
      newErrors.synopsis = "Synopsis is required";
    }

    // Validate casts_id format if provided
    if (formData.casts_id.trim()) {
      const castsArray = formData.casts_id.split(",").map((c) => c.trim());
      const invalidCasts = castsArray.filter((c) => !c || isNaN(parseInt(c)));
      if (invalidCasts.length > 0) {
        newErrors.casts_id = "Cast IDs must be numbers separated by commas";
      }
    }

    // Poster image required for new movies
    if (!isEditing && !posterFile) {
      newErrors.poster_image = "Poster image is required";
    }

    // Validate showtimes
    showtimeData.forEach((showtime, index) => {
      if (!showtime.date) {
        newErrors[`showtime_date_${index}`] = `Showtime ${
          index + 1
        } date is required`;
      }
      if (!showtime.time) {
        newErrors[`showtime_time_${index}`] = `Showtime ${
          index + 1
        } time is required`;
      }
      if (!showtime.location_id || isNaN(showtime.location_id)) {
        newErrors[`showtime_location_${index}`] = `Showtime ${
          index + 1
        } valid location ID is required`;
      }
      if (!showtime.cinema_id || isNaN(showtime.cinema_id)) {
        newErrors[`showtime_cinema_${index}`] = `Showtime ${
          index + 1
        } valid cinema ID is required`;
      }
    });

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

      // Append basic movie data (sesuai dengan backend Go)
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("synopsis", formData.synopsis.trim());
      formDataToSend.append("duration_minutes", formData.duration_minutes);
      formDataToSend.append("release_date", formData.release_date);
      formDataToSend.append("directors_id", formData.directors_id);

      if (formData.genres_id.trim()) {
        formDataToSend.append("genres_id", formData.genres_id.trim());
      }

      if (formData.casts_id.trim()) {
        formDataToSend.append("casts_id", formData.casts_id.trim());
      }

      if (formData.rating.trim()) {
        formDataToSend.append("rating", formData.rating.trim());
      }

      // Append showtime data as arrays (sesuai dengan backend Go)
      showtimeData.forEach((showtime) => {
        formDataToSend.append("showtime_dates[]", showtime.date);
        formDataToSend.append("showtime_times[]", showtime.time);
        formDataToSend.append("showtime_location_ids[]", showtime.location_id);
        formDataToSend.append("showtime_cinema_ids[]", showtime.cinema_id);
      });

      // Append files
      if (posterFile) {
        formDataToSend.append("poster_image", posterFile);
      }

      if (bgFile) {
        formDataToSend.append("bg_path", bgFile);
      }

      let url, method, successMessage;

      // SESUAIKAN DENGAN ENDPOINT BACKEND ANDA
      if (isEditing) {
        url = `${import.meta.env.VITE_BE_HOST}/admin/movies/${movieId}`;
        method = "PATCH";
        successMessage = "Movie updated successfully!";
      } else {
        url = `${import.meta.env.VITE_BE_HOST}/admin/movies/add`;
        method = "POST";
        successMessage = "Movie added successfully!";
      }

      console.log("Sending request to:", url);
      console.log("Method:", method);

      // Debug: lihat data yang dikirim
      console.log("=== DATA YANG DIKIRIM ===");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("=========================");

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      console.log("Parsed response:", data);

      if (response.ok && data.success) {
        toast.success(successMessage);

        if (!isEditing) {
          resetForm(); // SEKARANG resetForm sudah terdefinisi
        }

        setTimeout(() => {
          navigate("/movieList");
        }, 1500);
      } else {
        const errorMessage =
          data.error ||
          data.message ||
          `Failed to ${isEditing ? "update" : "add"} movie`;
        toast.error(errorMessage);
        console.error("Server error:", errorMessage);

        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (error) {
      console.error(`${isEditing ? "Update" : "Add"} movie error:`, error);
      toast.error(error.message || "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // Hapus variabel 'index' yang tidak digunakan di JSX
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditing ? "Edit Movie" : "Add New Movie"}
            </h1>
          </div>

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            {/* Poster Image */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Poster Image (Required)
              </label>
              <label className="inline-block">
                <div className="bg-blue-600 text-white px-6 py-2.5 rounded-md cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium">
                  {posterFile ? "Change Image" : "Upload"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              {posterFile && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ {posterFile.name}
                </p>
              )}
              {errors.poster_image && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.poster_image}
                </p>
              )}
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Background Image (Optional)
              </label>
              <label className="inline-block">
                <div className="bg-blue-600 text-white px-6 py-2.5 rounded-md cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium">
                  {bgFile ? "Change Image" : "Upload"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              {bgFile && (
                <p className="mt-2 text-xs text-green-600">✓ {bgFile.name}</p>
              )}
            </div>

            {/* Movie Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Movie Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full border ${
                  errors.title ? "border-red-300" : "border-gray-200"
                } rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Genre ID */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Genre ID (comma-separated for multiple)
              </label>
              <input
                type="text"
                name="genres_id"
                value={formData.genres_id}
                onChange={handleInputChange}
                className={`w-full border ${
                  errors.genres_id ? "border-red-300" : "border-gray-200"
                } rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                disabled={loading}
                placeholder="1,2,3"
              />
              {errors.genres_id && (
                <p className="mt-1 text-sm text-red-600">{errors.genres_id}</p>
              )}
            </div>

            {/* Release date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Release date
                </label>
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  className={`w-full border ${
                    errors.release_date ? "border-red-300" : "border-gray-200"
                  } rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                  disabled={loading}
                />
                {errors.release_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.release_date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full border ${
                    errors.duration_minutes
                      ? "border-red-300"
                      : "border-gray-200"
                  } rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                  disabled={loading}
                />
                {errors.duration_minutes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.duration_minutes}
                  </p>
                )}
              </div>
            </div>

            {/* Director ID */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Director ID
              </label>
              <input
                type="number"
                name="directors_id"
                value={formData.directors_id}
                onChange={handleInputChange}
                className={`w-full border ${
                  errors.directors_id ? "border-red-300" : "border-gray-200"
                } rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                disabled={loading}
              />
              {errors.directors_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.directors_id}
                </p>
              )}
            </div>

            {/* Cast IDs */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Cast IDs (comma-separated for multiple)
              </label>
              <input
                type="text"
                name="casts_id"
                value={formData.casts_id}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled={loading}
                placeholder="1,2,3"
              />
              {errors.casts_id && (
                <p className="mt-1 text-sm text-red-600">{errors.casts_id}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Rating (optional)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled={loading}
              />
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Synopsis
              </label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                rows="5"
                className={`w-full border ${
                  errors.synopsis ? "border-red-300" : "border-gray-200"
                } rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50`}
                disabled={loading}
              />
              {errors.synopsis && (
                <p className="mt-1 text-sm text-red-600">{errors.synopsis}</p>
              )}
            </div>

            {/* Showtimes */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Showtimes
              </label>
              {showtimeData.map((showtime, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-200 rounded-md"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Showtime {index + 1}
                    </span>
                    {showtimeData.length > 1 && (
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={showtime.date}
                        onChange={(e) =>
                          handleShowtimeChange(index, "date", e.target.value)
                        }
                        className={`w-full border ${
                          errors[`showtime_date_${index}`]
                            ? "border-red-300"
                            : "border-gray-200"
                        } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                        disabled={loading}
                      />
                      {errors[`showtime_date_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`showtime_date_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={showtime.time}
                        onChange={(e) =>
                          handleShowtimeChange(index, "time", e.target.value)
                        }
                        className={`w-full border ${
                          errors[`showtime_time_${index}`]
                            ? "border-red-300"
                            : "border-gray-200"
                        } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                        disabled={loading}
                      />
                      {errors[`showtime_time_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`showtime_time_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
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
                        className={`w-full border ${
                          errors[`showtime_location_${index}`]
                            ? "border-red-300"
                            : "border-gray-200"
                        } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                        disabled={loading}
                      />
                      {errors[`showtime_location_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`showtime_location_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
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
                        className={`w-full border ${
                          errors[`showtime_cinema_${index}`]
                            ? "border-red-300"
                            : "border-gray-200"
                        } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50`}
                        disabled={loading}
                      />
                      {errors[`showtime_cinema_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`showtime_cinema_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddShowtime}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Showtime</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 rounded-md hover:bg-blue-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : "Save Movie"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MovieForm;
