import { useState } from "react";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changePassword = async (email, oldPassword, newPassword) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/profile/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            old_password: oldPassword,
            new_password: newPassword,
            // Hapus confirm_password karena tidak digunakan di backend
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Password successfully updated!",
        };
      } else {
        return {
          success: false,
          message: data.error || "Failed to change password",
        };
      }
    } catch (error) {
      console.error("Error changing password:", error);
      return {
        success: false,
        message: "An error occurred while changing password",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setMessage({ type: "", text: "" });

    if (!validate()) {
      setMessage({
        type: "error",
        text: "Please fill all fields correctly.",
      });
      return;
    }

    const result = await changePassword(
      formData.email,
      formData.oldPassword,
      formData.newPassword
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message,
      });
      // Reset form
      setFormData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Auto redirect simulation
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.message,
      });
    }
  };

  const handleBackToLogin = () => {
    // Reset form and messages
    setFormData({
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[url(/sign-up.svg)] overflow-y-hidden bg-cover bg-center p-4">
      {/* Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <img src="/tickitz white.svg" alt="Tickitz Logo" />
      </div>

      {/* Main Container */}
      <main className="flex justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Change Password 🔐
            </h1>
            <p className="text-gray-500">
              Enter your email and passwords to change your account password
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : message.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Change Password Form */}
          <div>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Old Password Field */}
            <div className="mb-4">
              <label
                htmlFor="oldPassword"
                className="block mb-2 text-gray-700 font-medium"
              >
                Old Password
              </label>
              <div
                className={`flex items-center border rounded-md transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                  errors.oldPassword ? "border-red-300" : "border-gray-300"
                }`}
              >
                <input
                  type={showPassword.oldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  placeholder="Enter your old password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border-none outline-none rounded-l-md"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("oldPassword")}
                  className="px-3 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword.oldPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block mb-2 text-gray-700 font-medium"
              >
                New Password
              </label>
              <div
                className={`flex items-center border rounded-md transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                  errors.newPassword ? "border-red-300" : "border-gray-300"
                }`}
              >
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border-none outline-none rounded-l-md"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("newPassword")}
                  className="px-3 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword.newPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-gray-700 font-medium"
              >
                Confirm New Password
              </label>
              <div
                className={`flex items-center border rounded-md transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                }`}
              >
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border-none outline-none rounded-l-md"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirmPassword")}
                  className="px-3 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword.confirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 text-white rounded-md text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Processing..." : "Change Password"}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <button
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
