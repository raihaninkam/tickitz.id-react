import { MoreHorizontal, Star, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProfileSidebar = ({ onImageUpload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
  );
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const firstName = user.first_name;
  const lastName = user.last_name;
  const poin = user.poin;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      // Call parent component's callback with the file
      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Info Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
            INFO
          </span>
          <button className="text-blue-600 hover:text-blue-700">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden relative cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleImageClick}
          >
            {user?.profile_picture ? (
              <img
                src={`${import.meta.env.VITE_BE_HOST}/public/${
                  user.profile_picture
                }`}
                alt="User Avatar"
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
              />
            ) : (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
              />
            )}

            {/* Overlay with upload icon */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>

            {/* Hover ring effect */}
            <div
              className={`absolute -inset-1 rounded-full border-2 border-blue-500 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <h3 className="text-lg font-semibold text-gray-900">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-gray-500">Moviegoers</p>

          {/* Upload hint */}
          <p className="text-xs text-gray-400 mt-1">Click photo to change</p>
        </div>

        {/* Loyalty Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Loyalty Points
          </h4>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-sm opacity-90">Moviegoers</span>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600 fill-current" />
              </div>
            </div>
            <div className="text-2xl font-bold relative z-10">
              {poin}
              <span className="text-sm font-normal opacity-75 ml-1">
                points
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-600">
              180 points become a master
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: "64%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
