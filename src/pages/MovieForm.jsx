import { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import NavbarAdmin from "../components/NavbarAdmin";


const MovieForm = ({ movie = null, onSave }) => {
  const [formData, setFormData] = useState({
    movieName: "",
    category: "",
    releasedDate: "",
    duration: "",
    hours: "",
    minutes: "",
    directorName: "",
    cast: "",
    synopsis: "",
    location: "",
    showDate: "",
    showTime: "08:30am",
    thumbnail: "/api/placeholder/60/60",
  });

  // Load movie data when editing
  useEffect(() => {
    if (movie) {
      // Parse existing duration if editing
      const durationParts = movie.duration?.match(/(\d+)\s*Hours?\s*(\d+)\s*Minute/i);
      const hours = durationParts ? durationParts[1] : "";
      const minutes = durationParts ? durationParts[2] : "";
      
      setFormData({
        movieName: movie.movieName || "",
        category: movie.category || "",
        releasedDate: movie.releasedDate || "",
        duration: movie.duration || "",
        hours: hours,
        minutes: minutes,
        directorName: movie.directorName || "",
        cast: movie.cast || "",
        synopsis: movie.synopsis || "",
        location: movie.location || "",
        showDate: movie.showDate || "",
        showTime: movie.showTime || "08:30am",
        thumbnail: movie.thumbnail || "/api/placeholder/60/60",
      });
    }
  }, [movie]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.movieName || !formData.category || !formData.releasedDate || !formData.hours || !formData.minutes) {
      alert("Please fill in all required fields");
      return;
    }
    
    const duration = `${formData.hours} Hours ${formData.minutes} Minute`;
    const movieData = { ...formData, duration };
    
    // If editing, include the movie ID
    if (movie) {
      movieData.id = movie.id;
    }
    
    onSave(movieData);
  };

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/movieList')
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
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to List
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {movie ? "Edit Movie" : "Add New Movie"}
              </h1>
            </div>
          </div>

          {/* Form */}
          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%236b7280' font-size='14'%3EImg%3C/text%3E%3C/svg%3E"
                  alt="Movie thumbnail"
                  className="w-16 h-16 rounded object-cover border"
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 w-full sm:w-auto"
                >
                  Upload
                </button>
              </div>
            </div>

            {/* Movie Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="movieName"
                value={formData.movieName}
                onChange={handleInputChange}
                placeholder="Spider-Man: Homecoming"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Action, Adventure, Sci-Fi"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Release Date and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Release Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="releasedDate"
                  value={formData.releasedDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hour / minute) <span className="text-red-500">*</span>
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
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <span className="flex items-center text-gray-500 text-sm">hours</span>
                  <input
                    type="number"
                    name="minutes"
                    value={formData.minutes}
                    onChange={handleInputChange}
                    placeholder="30"
                    min="0"
                    max="59"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <span className="flex items-center text-gray-500 text-sm">min</span>
                </div>
              </div>
            </div>

            {/* Director Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director Name</label>
              <input
                type="text"
                name="directorName"
                value={formData.directorName}
                onChange={handleInputChange}
                placeholder="Jon Watts"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Cast */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cast</label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleInputChange}
                placeholder="Tom Holland, Michael Keaton, Robert Downey Jr."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Synopsis</label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                placeholder="Thrilled by his experience with the Avengers, Peter returns home, where he lives with his Aunt May, under the watchful eye of his new mentor Tony Stark..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Purwokerto, Bandung, Bekasi"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple locations with commas</p>
            </div>

            {/* Set Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Set Date & Time</label>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="date"
                    name="showDate"
                    value={formData.showDate}
                    onChange={handleInputChange}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500 text-sm">Set a date</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    type="button"
                    className="w-8 h-8 border-2 border-dashed border-blue-600 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50 flex-shrink-0"
                    title="Add show time"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-200">08:30am</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-200">10:30am</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-200">02:00pm</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-200">05:30pm</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Click to select show times or use the + button to add new times</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>{movie ? "Update Movie" : "Save Movie"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MovieForm;