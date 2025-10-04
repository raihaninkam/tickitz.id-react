import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProfileSidebar from "../components/ProfileSidebar";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyNavbar from "../components/Navbar";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userEmail = useSelector((state) => state.auth?.user?.email);
  const token = useSelector((state) => state.auth?.token);
  const { user } = useSelector((state) => state.auth);

  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const phoneNumber = user?.phone_number || "";

  // Initialize formData with values from Redux
  const [formData, setFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    newPassword: "",
    confirmPassword: "",
  });

  // Update formData when user data changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    }));
  }, [firstName, lastName, phoneNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Handle image upload from ProfileSidebar
  const handleImageUpload = (imageFile) => {
    setProfileImage(imageFile);
    console.log("Image file received:", imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Validate password confirmation if password is being changed
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    // Create FormData to handle both text and file data
    const formDataPayload = new FormData();
    formDataPayload.append("first_name", formData.firstName || "");
    formDataPayload.append("last_name", formData.lastName || "");
    formDataPayload.append("phone_number", formData.phoneNumber || "");

    // Add password if provided
    if (formData.newPassword) {
      formDataPayload.append("password", formData.newPassword);
    }

    // Add profile image if exists
    if (profileImage) {
      formDataPayload.append("image", profileImage);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BE_HOST}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataPayload,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        console.log("Profile updated:", data);

        // Update Redux state dengan data terbaru
        const updatedUserData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
        };

        // Jika ada profile picture baru dari response
        if (data.data?.profile_picture) {
          updatedUserData.profile_picture = data.data.profile_picture;
        }

        // Dispatch update ke Redux
        dispatch(updateUser(updatedUserData));

        // Reset profile image state after successful upload
        setProfileImage(null);

        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-opacity-50 font-sans">
      {/* Header Navigation */}
      <MyNavbar />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Profile Sidebar with image upload callback */}
          <ProfileSidebar onImageUpload={handleImageUpload} />

          {/* Content Area */}
          <main className="min-h-96">
            {/* Tabs */}
            <div className="flex border-b-2 border-slate-200 mb-8 bg-white rounded-xl p-6 shadow-sm">
              <Link
                to="/profile"
                className="py-3 pr-10 text-slate-800 text-sm font-medium relative"
              >
                Account Settings
                <div className="text-blue-600 absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700"></div>
              </Link>
              <Link
                to="/order-history"
                className="py-3 pr-10 text-slate-400 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                Order History
              </Link>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
                <h2 className="text-base font-semibold text-slate-800 mb-6">
                  Details Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-500 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-500 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-500 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      disabled={true}
                      readOnly={true}
                      className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white cursor-not-allowed"
                      value={userEmail || ""}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-500 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
                <h2 className="text-base font-semibold text-slate-800 mb-6">
                  Account and Privacy
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-500 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        className="px-4 py-3 pr-12 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white w-full placeholder-slate-400"
                        placeholder="Write your new password"
                        value={formData.newPassword || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 text-base hover:text-slate-500"
                        onClick={() => togglePasswordVisibility("new")}
                        disabled={isSubmitting}
                      >
                        {showNewPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-500 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="px-4 py-3 pr-12 border border-slate-200 rounded-lg text-sm bg-slate-50 transition-all focus:outline-none focus:border-blue-700 focus:bg-white w-full placeholder-slate-400"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword || ""}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 p-1 text-base hover:text-slate-500"
                        onClick={() => togglePasswordVisibility("confirm")}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                </div>

                {formData.newPassword && (
                  <p className="text-xs text-slate-500 mt-2">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-700 text-white px-12 py-3.5 rounded-lg text-sm font-semibold transition-all hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update changes"
                )}
              </button>
            </form>
          </main>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ProfilePage;
